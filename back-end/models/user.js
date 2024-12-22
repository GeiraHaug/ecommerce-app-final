module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        Id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        FirstName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        LastName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        Username: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Password: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false,
        },
        Salt: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false,
        },
        Address: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        Phone: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    User.associate = function(models) {
        User.belongsTo(models.Role);
        User.belongsTo(models.Membership);
        User.hasMany(models.Order);
        User.hasOne(models.Cart);
    };

    return User;
};