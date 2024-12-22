module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
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

    Role.associate = function(models) {
        Role.hasMany(models.User);
    };

    return Role;
};