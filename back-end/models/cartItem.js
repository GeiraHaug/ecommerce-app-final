module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define('CartItem', {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        CarItemPrice: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    CartItem.associate = function(models) {
        CartItem.belongsTo(models.Cart);
        CartItem.belongsTo(models.Product);
    };

    return CartItem;
};