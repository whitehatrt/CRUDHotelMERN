const bcrypt = require("bcrypt");
const bcrypt_p = require("bcrypt-promise");
const jwt = require("jsonwebtoken");
const { TE, to } = require("../services/util.service");
const CONFIG = require("../config/config");

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define("rooms",
    {
      room_type: { type: DataTypes.STRING, allowNull: false },
      room_price: { type: DataTypes.INTEGER, allowNull: false },
      room_availability_from: { type: DataTypes.DATE, allowNull: false },
      room_availability_to: { type: DataTypes.DATE, allowNull: false },
      status: { type: DataTypes.INTEGER, allowNull: false }, // 0 for Available ,1 for Booked
      created_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      hotel_id: { type: DataTypes.INTEGER, allowNull: false },
    
    },
    {
      timestamps: false,
    },
    {
      freezeTableName: true,
    }
  );

  Model.associate = function (models) {
    this.belongsTo(models.hotels, { foreignKey: "hotel_id", onDelete: "cascade" });
  };

  Model.prototype.getJWT = function () {
    let expiration_time = parseInt(CONFIG.development.jwt_expiration);
    return (
      "Bearer " +
      jwt.sign({ userId: this.id }, CONFIG.development.jwt_encryption, {
        expiresIn: expiration_time,
      })
    );
  };
  return Model;
};
