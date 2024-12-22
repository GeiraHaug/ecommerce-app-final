class CartItemService {
    constructor(db) {
        this.client = db.sequelize;
        this.CartItem = db.CartItem;
        this.Cart = db.Cart;
        this.Product = db.Product;
    }

    async addItemToCart(cartId, productId, quantity) {
        const existingCartItem = await this.CartItem.findOne({
            where: { CartId: cartId, ProductId: productId },
        });

        if (existingCartItem) {
            return this.CartItem.update(
                { Quantity: existingCartItem.Quantity + quantity },
                { where: { Id: existingCartItem.Id } }
            );
        } else {
            return this.CartItem.create({
                CartId: cartId,
                ProductId: productId,
                Quantity: quantity,
            });
        }
    }

    async updateCartItemQuantity(cartItemId, newQuantity) {
        return this.CartItem.update(
            { Quantity: newQuantity },
            { where: { Id: cartItemId } }
        );
    }

    async removeItemFromCart(cartItemId) {
        return this.CartItem.destroy({
            where: { Id: cartItemId },
        });
    }

    async getCartItems(cartId) {
        return this.CartItem.findAll({
            where: { CartId: cartId },
            include: {
                model: this.Product,
            },
        });
    }
}

module.exports = CartItemService;