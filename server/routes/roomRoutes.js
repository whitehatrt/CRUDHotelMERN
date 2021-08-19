const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController/roomController");
router.get("/", function (req, res, next) {
    res.json({
      status: "success",
      message: "Hotels API",
      data: { version_number: "v1.0.0" },
    });
  });
  

  router.post("/createRoom",   roomController.createRoom);
router.post("/browseRooms",   roomController.browseRooms);
router.post("/browseRoomsByDate",   roomController.browseRoomsByDate);
router.post("/browseRoomById",   roomController.browseRoomById);
router.post("/browseRoomByHotelId",   roomController.browseRoomByHotelId);
router.post("/deleteRoom",   roomController.deleteRoom);



module.exports = router;
