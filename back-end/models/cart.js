module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('Cart', {
        Id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        }
    });

    Cart.associate = function(models) {
        Cart.belongsTo(models.User);
        Cart.hasMany(models.CartItem);
    };

    return Cart;
};