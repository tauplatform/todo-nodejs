var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

if (process.env.DATABASE_URL) {
    var sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else {
    var dbPath = path.join(Rho.Application.userFolder, config.storage);
    //console.log("$$$ DBPATH = "+dbPath);
    config.storage = dbPath;
    //var sequelize = new Sequelize(dbPath, null, null, {dialect: 'sqlite'});
    var sequelize = new Sequelize(dbPath, null, null, config);
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
