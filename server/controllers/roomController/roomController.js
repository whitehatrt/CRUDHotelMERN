const { to, TE, ReE, ReS } = require("../../services/util.service");
const crypto = require("crypto");
const models = require("../../models");
const RoomModel = models.rooms;
const HotelModel = models.hotels;
const { Op,fn,col,where } =require('sequelize');
const fs = require("fs");


var path = require("path");

const createRoom= async function (req, res) {
    if (req.body.roomId == undefined) {
      let err, roomData;
      let room = {};
      room.room_type = req.body.room_type;
      room.room_price = req.body.room_price;
      room.room_availability_from = req.body.room_availability_from;
      room.room_availability_to = req.body.room_availability_to;
      room.status = req.body.status;
      room.hotel_id = req.body.hotel_id;
      [err, roomData] = await to(RoomModel.create(room));
      return ReS(res, {
        message: "Room successfully Added.",
        data: roomData,
      });
    } else {
  
      let err, roomData;
     
      let room = {};
      room.room_type = req.body.room_type;
      room.room_price = req.body.room_price;
      room.room_availability_from = req.body.room_availability_from;
      room.room_availability_to = req.body.room_availability_to;
      room.status = req.body.status;
      room.hotel_id = req.body.hotel_id;
      [err, roomData] = await to(
        RoomModel.update(room, {
          where: { id: req.body.roomId },
        })
      );
      return ReS(res, {
        message: "Room Details successfully Updated.",
        data: roomData,
      });
    }
  
    
};
module.exports.createRoom = createRoom;


const browseRooms = async function (req, res) {
  let err, room;
  [err, room] = await to(
    RoomModel.findAll({
        where:{
            status: 0
        },
        // attributes: ['id',"room_type","room_price","status","created_date","hotel_id",[fn('date', col('room_availability_from')),'from'],[fn('date', col('room_availability_to')),'to']]
    })
  );
 
  if (err) return ReE(res, { message: "Oops something went wrong." });
  return ReS(res, { message: "Room list", roomInfos: room });
};
module.exports.browseRooms = browseRooms;

const browseRoomsByDate = async function (req, res) {
  let err, room,hotel;
  console.log(req.body.room_availability_from);
 
  [err, hotel] = await to(
      HotelModel.findAll()
    );
  for (let val in hotel){
    [err, room] = await to(
      RoomModel.findAll({
          where:{        
            status:0,  
           [Op.or]:[{ 
             [Op.and]: [
              where(fn('date', col('room_availability_from')), '>=', req.body.room_availability_from),
              where(fn('date', col('room_availability_to')), '<=', req.body.room_availability_to), 
          ],},{
             [Op.and]: [
              where(fn('date', col('room_availability_from')), '<=', req.body.room_availability_from),
              where(fn('date', col('room_availability_to')), '>=', req.body.room_availability_to), 
          ],
        }],
        hotel_id:hotel[val].id
          },
         
      }),
      
    );
    hotel[val].setDataValue('availableRooms',room);
    }
    
  if (err) return ReE(res, { message: "Oops something went wrong." });
  return ReS(res, { message: "Room list", roomInfos: hotel});
};
module.exports.browseRoomsByDate = browseRoomsByDate;

const browseRoomById = async function (req, res) {
  let err, room;
  [err, room] = await to(
    RoomModel.findAll({
        where:{
            id: req.body.roomId
        }
    })
  );
 
  if (err) return ReE(res, { message: "Oops something went wrong." });
  return ReS(res, { message: "Room ", roomInfos: room });
};
module.exports.browseRoomById = browseRoomById;

const browseRoomByHotelId = async function (req, res) {
  let err, room;
  [err, room] = await to(
    RoomModel.findAll({
        where:{
            hotel_id: req.body.hotelId
        }
    })
  );
 
  if (err) return ReE(res, { message: "Oops something went wrong." });
  return ReS(res, { message: "Room ", roomInfos: room });
};
module.exports.browseRoomByHotelId = browseRoomByHotelId;

const deleteRoom = async function (req, res) {
  let err, room;
  [err, room] = await to(
    RoomModel.destroy({
        where:{
            id: req.body.roomId
        }
    })
  );
 
  if (err) return ReE(res, { message: "Oops something went wrong." });
  return ReS(res, { message: "Room Deleted", roomInfos: room });
};
module.exports.deleteRoom = deleteRoom;

