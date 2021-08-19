const { to, TE, ReE, ReS } = require("../../services/util.service");
const crypto = require("crypto");
const models = require("../../models");
const HotelModel = models.hotels;

const fs = require("fs");


var path = require("path");

const createHotel = async function (req, res) {
    if (req.body.hotelId == undefined) {
      let err, hotelData;
      let hotel = {};
      hotel.hotel_name = req.body.hotel_name;
      hotel.hotel_country = req.body.hotel_country;
      hotel.hotel_address = req.body.hotel_address;
      [err, hotelData] = await to(HotelModel.create(hotel));
      return ReS(res, {
        message: "Hotel successfully Added.",
        data: hotelData,
      });
    } else {
  
      let err, hotelData;
     
      let hotel = {};
      hotel.hotel_name = req.body.hotel_name;
      hotel.hotel_country = req.body.hotel_country;
      hotel.hotel_address = req.body.hotel_address;

      [err, hotelData] = await to(
        HotelModel.update(hotel, {
          where: { id: req.body.hotelId },
        })
      );
      return ReS(res, {
        message: "Hotel Details successfully Updated.",
        data: hotelData,
      });
    }
  
    
};
module.exports.createHotel = createHotel;


const browseHotels = async function (req, res) {
  let err, hotel;
  [err, hotel] = await to(
    HotelModel.findAll()
  );
 
  if (err) return ReE(res, { message: "Oops something went wrong." });
  return ReS(res, { message: "Hotel list", hotelInfos: hotel });
};
module.exports.browseHotels = browseHotels;

const browseHotelsById = async function (req, res) {
  let err, hotel;
  [err, hotel] = await to(
    HotelModel.findAll({
      where:{
        id:req.body.hotelId
      },
    })
  );
 
  if (err) return ReE(res, { message: "Oops something went wrong." });
  return ReS(res, { message: "Hotel list", hotelInfos: hotel });
};
module.exports.browseHotelsById = browseHotelsById;

const deleteHotel = async function (req, res) {
  let err, hotel;
  [err, hotel] = await to(
    HotelModel.destroy({
      where:{
        id:req.body.hotelId
      }
    })
  );
 
  if (err) return ReE(res, { message: "Oops something went wrong." });
  return ReS(res, { message: "Hotel Deleted", hotelInfos: hotel });
};
module.exports.deleteHotel = deleteHotel;
