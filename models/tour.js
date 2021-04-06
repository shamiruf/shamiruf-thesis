const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Tour
const TourSchema = new Schema({
  nameTour: {
    type: String,
    required: true,
  },
  travelMode: {
    type: String,
    required: false,
  },
  waypoints: {
    type: Array,
    required: false,
  },
  tourDescription: {
    type: String,
    required: false,
  },
  mapsLink: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  time: {
    type: Number,
    required: false,
  },
  length: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
});

// Access to this file
module.exports = Tour = mongoose.model("tour", TourSchema);
