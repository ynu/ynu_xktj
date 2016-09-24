"use strict";

module.exports = function(sequelize, DataTypes) {
    var xktj = sequelize.define("xktj", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        xm: DataTypes.STRING,
        csrq: DataTypes.STRING,
        xb: DataTypes.STRING,
        zyjszw: DataTypes.STRING,
        zgxw: DataTypes.STRING,
        xl: DataTypes.STRING,
        szxy: DataTypes.STRING,
        zyxk_xkml: DataTypes.STRING,
        zyxk_yjxk: DataTypes.STRING,
        zyxk_ejxk: DataTypes.STRING,
        zyxk_ds: DataTypes.STRING,
        dexk_xkml: DataTypes.STRING,
        dexk_yjxk: DataTypes.STRING,
        dexk_ejxk: DataTypes.STRING,
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