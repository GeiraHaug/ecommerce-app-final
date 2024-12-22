module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define('OrderItem', {
        Id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Quantity: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        PriceAtPurchase: {
            type: Sequelize.DataTypes.DECIMAL(8, 2),
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    OrderItem.associate = function(models) {
        OrderItem.belongsTo(models.Order);
        OrderItem.belongsTo(models.Product);
    };

    return OrderItem;
};