const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const pe = require("parse-error");
const cors = require("cors");
const multer = require("multer");

const app = express();

// CORS
app.use(cors());

const hotelsRoutes = require("./routes/hotelsRoutes");
const roomRoutes = require("./routes/roomRoutes");

app.use(logger("dev"));
app.use(bodyParser.json({ limit: "50mb" })); // Increase the size if needed. This size is the size of content that is passed over post request.
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" })); // Increase the size if needed

//Passport
app.use(passport.initialize());

const db = require("./models");


app.use("/api/hotels", hotelsRoutes);
app.use("/api/rooms", roomRoutes);
app.get("/", (req, res, next)=>{
  res.json({
    status: "success",
    message: "Hotels",
    data: { version_number: "v1.0.0" },
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  console.error(err);
  res.status(err.status || 500);
  res.render("error");
});

//This is here to handle all the uncaught promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Uncaught Error", pe(error));
});

db.sequelize.sync().then((req) => {
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on Post ${PORT}`);
  });
});

module.exports = app;
