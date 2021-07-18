"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Films extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Films.hasMany(models.user, {
      //   foreignKey: "id",
      //   onDelete: "cascade",
      // });
      this.belongsTo(models.user, {
        foreignKey: "addedBy",
        targetKey: "id",
        onDelete: "CASCADE",
      });
    }
  }
  Films.init(
    {
      name: DataTypes.STRING,
      synopsis: DataTypes.STRING,
      addedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Films",
    }
  );

  return Films;
};
