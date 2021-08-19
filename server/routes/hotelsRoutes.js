const express = require("express");
const router = express.Router();

const hotelsController = require("../controllers/hotelsController/hotelsController");
router.get("/", function (req, res, next) {
    res.json({
      status: "success",
      message: "Hotels API",
      data: { version_number: "v1.0.0" },
    });
  });
  

router.post("/browseHotels",   hotelsController.browseHotels);
router.post("/browseHotelsById",   hotelsController.browseHotelsById);
router.post("/createHotel",   hotelsController.createHotel);
router.post("/deleteHotel",   hotelsController.deleteHotel);



module.exports = router;
