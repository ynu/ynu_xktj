"use strict";

module.exports = function(sequelize, DataTypes) {
    var xktj = sequelize.define("xktj", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        xm: DataTypes.STRING,
        xb: DataTypes.STRING,
        zyjszw: DataTypes.STRING,
        zgxw: DataTypes.STRING,
        xl: DataTypes.STRING,
        szxy: DataTypes.STRING,
        zyxk: DataTypes.STRING,
        zyxk_ds: DataTypes.STRING,
        dexk: DataTypes.STRING,
        dexk_ds: DataTypes.STRING,
        sjhm: DataTypes.STRING,
        dzyx: DataTypes.STRING,
        bz: DataTypes.STRING
    }, {
        classMethods: {
            // associate: function(models) {
            //     User.hasMany(models.Task)
            // }
        }
    });

    return xktj;
};