class OrderService {
    constructor(db) {
        this.client = db.sequelize;
        this.Order = db.Order;
        this.OrderItem = db.OrderItem;
        this.User = db.User;
        this.Product = db.Product;
    }

    async getUserOrders(userId) {
        return this.Order.findAll({
            where: { UserId: userId },
            include: [
                {
                    model: this.OrderItem,
                    include: [
                        {
                            model: this.Product,
                            attributes: ['Name'],
                        },
                    ],
                },
            ],
        });
    }

    async getOneForUser(userId, orderId) {
        return this.Order.findOne({
            where: { Id: orderId, UserId: userId },
            include: [
                {
                    model: this.OrderItem,
                    include: { model: this.Product },
                },
            ],
        });
    }

    async updateStatus(orderId, status) {
        return this.Order.update(
            { Status: status }, 
            { where: { Id: orderId } }
        );
    }

    async create(userId, orderData, orderItems) {
        const transaction = await this.client.transaction();
        try {
            const orderNumber = Math.random().toString(36).substr(2, 8).toUpperCase();

            const order = await this.Order.create(
                {
                    UserId: userId,
                    Status: orderData.Status || 'In Progress',
                    TotalPrice: orderData.TotalPrice || 0,
                    OrderNumber: orderNumber,
                },
                { transaction }
            );

            for (const item of orderItems) {
                await this.OrderItem.create(
                    {
                        OrderId: order.Id,
                        ProductId: item.ProductId,
                        Quantity: item.Quantity,
                        PriceAtPurchase: item.PriceAtPurchase,
                    },
                    { transaction }
                );
            }

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

        async getAllOrders() {
            return this.Order.findAll({
                include: [
                    { model: this.User, 
                      attributes: { exclude: ['Password', 'Salt'] }  
                    },
                    { 
                        model: this.OrderItem,
                        include: { model: this.Product }
                    }
                ]
            });
        }
}

module.exports = OrderService;