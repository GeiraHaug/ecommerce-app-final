module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define('Membership', {
        Id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        FromTotalPurchases: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        ToTotalPurchases: {
            type: Sequelize.DataTypes.INTEGER,
        },
        Discount: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    Membership.associate = function(models) {
        Membership.hasMany(models.User);
    };

    return Membership;
};