const bcrypt = require("bcrypt");
const bcrypt_p = require("bcrypt-promise");
const jwt = require("jsonwebtoken");
const { TE, to } = require("../services/util.service");
const CONFIG = require("../config/config");

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define("hotels",
    {
      hotel_name: { type: DataTypes.STRING, allowNull: false },
      hotel_country: { type: DataTypes.STRING, allowNull: false },
      hotel_address: { type: DataTypes.STRING, allowNull: false },
      created_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },     
    },
    {
      timestamps: false,
    },
    {
      freezeTableName: true,
    }
  );

 

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
