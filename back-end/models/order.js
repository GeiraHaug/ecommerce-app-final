module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define(
        'Order',
        {
            Id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            Status: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                defaultValue: 'In Progress',
            },
            TotalPrice: {
                type: Sequelize.DataTypes.DECIMAL(8, 2),
                allowNull: false,
            },
            OrderNumber: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            timestamps: true,
        }
    );

    Order.associate = function (models) {
        Order.belongsTo(models.User);
        Order.hasMany(models.OrderItem);
    };

    return Order;
};