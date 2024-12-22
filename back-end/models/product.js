module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('Product', {
        Id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false,
        },
        Price: {
            type: Sequelize.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        Quantity: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        ImageUrl: {
            type: Sequelize.DataTypes.STRING,
            allowNull: true,
        },
        Date_Added: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
        },
        isDeleted: {
            type: Sequelize.DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        timestamps: true,
    });

    Product.associate = function(models) {
        Product.belongsTo(models.Category);
        Product.belongsTo(models.Brand);
        Product.hasMany(models.OrderItem);
        Product.belongsToMany(models.Cart, { through: models.CartItem });
    };

    return Product;
};