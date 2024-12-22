var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var basename = path.basename(__filename);
var sequelize = new Sequelize({
    database: process.env.DATABASE_NAME, 
    username: process.env.ADMIN_USERNAME, 
    password: process.env.ADMIN_PASSWORD, 
    host: process.env.HOST, 
    dialect: process.env.DIALECT 
});

var db = {};
db.sequelize = sequelize;

fs.readdirSync(__dirname)
    .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize);
        db[model.name] = model;
    });
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false });

        console.log('Database synchronized successfully.');
    }   catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
})();

module.exports = db;