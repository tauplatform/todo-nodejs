var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

if (process.env.DATABASE_URL) {
    var sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
    Rho.Log.info("======================================================================================", "config");
    Rho.Log.info(Rho.Application.userFolder, "userFolder");
    Rho.Log.info(config.storage.toString(), "config");

    var dbPath = path.join(Rho.Application.userFolder, config.storage);
    Rho.Log.info(dbPath, "dbPath");
    var sequelize = new Sequelize(dbPath, config.username, config.password, config);
}

var db = {};

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;