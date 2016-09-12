"use strict";

module.exports = function(sequelize, DataTypes) {
    var xkdm = sequelize.define("xkdm", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mldm: DataTypes.STRING,
        mlmc: DataTypes.STRING,
        yjxkdm: DataTypes.STRING,
        yjxkmc: DataTypes.STRING,
        zydm: DataTypes.STRING,
        zymc: DataTypes.STRING,
        xwlx: DataTypes.STRING
    }, {
        classMethods: {
            // associate: function(models) {
            //     User.hasMany(models.Task)
            // }
        }
    });

    return xkdm;
};