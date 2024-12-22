module.exports = (sequelize, Sequelize) => {
    const Brand = sequelize.define('Brand', {
        Id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    Brand.associate = function(models) {
        Brand.hasMany(models.Product);
    };

    return Brand;
};