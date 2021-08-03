"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { default: axios } = require("axios");

let server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect("mongodb://localhost:27017/favorite-colors", { useNewUrlParser: true, useUnifiedTopology: true });

server.get("/test", (req, res) => {
  res.send("working fine");
});

// http://localhost:3001/allcolors
server.get("/allcolors", getAllColors);

// http://localhost:3001/favcolors
server.get("/favcolors", getFavColors);

// http://localhost:3001/addcolor
server.post("/addcolor", addColor);

// http://localhost:3001/deletecolor
server.delete("/deletecolor", deleteColor);

// http://localhost:3001/updatecolor
server.post("/updatecolor", updateColor);

class ColorData {
  constructor(data) {
    this.title = data.title;
    this.image = data.imageUrl;
  }
}

/////////////////////////
/////////////////////////

let favoriteColorsSchema = new mongoose.Schema({
  title: String,
  image: String,
});
let UserNameSchema = new mongoose.Schema({
  email: String,
  favoriteColors: [favoriteColorsSchema],
});

const favoriteColorsModel = mongoose.model("favoriteColors", favoriteColorsSchema);
const UserNameModel = mongoose.model("user", UserNameSchema);

function seedSuhaib() {
  let suhaib = new UserNameModel({
    email: "suhaib.m.ersan@gmail.com",
    favoriteColors: [{ title: "Black", image: "http://www.colourlovers.com/img/000000/100/100/Black.png" }],
  });
  suhaib.save();
}
// seedSuhaib();

function seedRazan() {
  let razan = new UserNameModel({
    email: "quraanrazan282@gmail.com",
    favoriteColors: [{ title: "Black", image: "http://www.colourlovers.com/img/000000/100/100/Black.png" }],
  });
  razan.save();
}
seedRazan();
let razan = new UserNameModel({
  email: "quraanrazan282@gmail.com",
  favoriteColors: [{ title: "Black", image: "http://www.colourlovers.com/img/000000/100/100/Black.png" }],
});
// razan.save();

/////////////////////////
/////////////////////////

async function getAllColors(req, res) {
  let apiData = await axios.get("https://ltuc-asac-api.herokuapp.com/allColorData");
  let classApiData = apiData.data.map((ele) => {
    return new ColorData(ele);
  });
  res.send(classApiData);
}
async function getFavColors(req, res) {
  let email = email.query.email;
  UserNameModel.findOne({ email: email }),
    (error, userData) => {
      if (error) {
        res.send(error);
      } else {
        res.send(userData.data);
      }
    };
}

async function addColor(req, res) {
  let title = req.query.title;
  let image = req.query.image;
  let email = req.query.email;

  let newColor = {
    title: title,
    image: image,
  };

  UserNameModel.findOne({ email: email }),
    (error, userData) => {
      if (error) {
        res.send(error);
      } else {
        userData.favoriteColors.push(newColor);
        userData.save();
        res.send(userData.favoriteColors);
      }
    };
}

async function deleteColor(req, res) {
  let indexNum = Number(req.params.id);
  let email = req.query.email;
  UserNameModel.findOne({ email: email }),
    (error, userData) => {
      if (error) {
        res.send(error);
      } else {
        userData.favoriteColors.splice(indexNum, 1);
        userData.save();
        res.send(userData.favoriteColors);
      }
    };
}

async function updateColor(req, res) {
  let indexNum = Number(req.params.id);
  let { title, image } = req.body;
  let newColor = {
    title: title,
    image: image,
  };
  UserNameModel.findOne({ email: email }),
    (error, userData) => {
      if (error) {
        res.send(error);
      } else {
        userData.favoriteColors.splice(indexNum, 1, newColor);
        userData.save();
        res.send(userData.favoriteColors);
      }
    };
}

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
