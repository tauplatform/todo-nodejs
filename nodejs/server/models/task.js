"use strict";

module.exports = function (sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        title: DataTypes.STRING,
        completed: DataTypes.BOOLEAN
    });
    return Task;
};