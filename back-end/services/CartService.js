const { Op } = require('sequelize');

class CartService {
    constructor(db) {
        this.Cart = db.Cart;
        this.CartItem = db.CartItem;
        this.Product = db.Product;
        this.Order = db.Order;
        this.OrderItem = db.OrderItem;
        this.User = db.User;
        this.Membership = db.Membership;
    }

    async getOrCreateCart(userId) {
        let cart = await this.Cart.findOne({ where: { UserId: userId } });
        if (!cart) {
            cart = await this.Cart.create({ UserId: userId });
        }
        return cart;
    }

    async getCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        return this.Cart.findOne({
            where: { Id: cart.Id },
            include: {
                model: this.CartItem,
            },
        });
    }

    async addToCart(userId, productId, quantity) {
        const product = await this.Product.findOne({ where: { Id: productId } });

        if (!product) {
            throw new Error('Product is not found.');
        }

        if (product.Quantity < quantity) {
            throw new Error('Product quantity is too low.');

        }

        const cart = await this.getOrCreateCart(userId);

        const cartItem = await this.CartItem.findOne({
            where: { CartId: cart.Id, ProductId: productId },
        });

        if (cartItem) {
            const newQuantity = cartItem.Quantity + quantity;
            if (product.Quantity < newQuantity) {
                throw new Error('Product quantity is too low.');
            }
            await cartItem.update({ Quantity: newQuantity });
        } else {
            await this.CartItem.create({
                CartId: cart.Id,
                ProductId: productId,
                Quantity: quantity,
                CarItemPrice: product.Price,
            });
        }
    }

    async checkoutCart(userId) {
        const cart = await this.getCart(userId);

        if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
            throw new Error('Cart is empty.');
        }

        const totalQuantity = cart.CartItems.reduce((sum, item) => sum + item.Quantity, 0);

        const user = await this.User.findOne({
            where: { Id: userId },
            include: [{ model: this.Membership }],
        });

        if (!user) {
            throw new Error('User is not found.');
        }

        const membershipDiscount = user.Membership?.Discount || 0;

        const totalPrice = cart.CartItems.reduce((sum, item) => {
            return sum + item.CarItemPrice * item.Quantity;
        }, 0);

        const finalPrice = totalPrice * (1 - membershipDiscount / 100);

        const order = await this.Order.create({
            UserId: userId,
            Status: 'In progress',
            TotalPrice: finalPrice,
            OrderNumber: `ORDER-${Date.now()}`,
        });

        for (const item of cart.CartItems) {
            const product = await this.Product.findOne({ where: { Id: item.ProductId } });

            if (!product) {
                throw new Error(`Product not found for productId: ${item.ProductId}`);
            }

            await this.OrderItem.create({
                OrderId: order.Id,
                ProductId: product.Id,
                Quantity: item.Quantity,
                PriceAtPurchase: item.CarItemPrice,
            });

            await product.update({ Quantity: product.Quantity - item.Quantity });
        }

        const newMembership = await this.Membership.findOne({
            where: {
                FromTotalPurchases: { [Op.lte]: totalQuantity },
                ToTotalPurchases: { [Op.gte]: totalQuantity },
            },
        });

        if (newMembership && newMembership.Id !== user.MembershipId) {
            await user.update({ MembershipId: newMembership.Id });
        }

        await this.CartItem.destroy({ where: { CartId: cart.Id } });

        return order;
    }
}

module.exports = CartService;