"use strict";

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        type: DataTypes.STRING
    }, {
        classMethods: {
            // associate: function(models) {
            //     User.hasMany(models.Task)
            // }
        }
    });

    return user;
};