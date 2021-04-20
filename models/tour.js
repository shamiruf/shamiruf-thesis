const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Tour
const TourSchema = new Schema({
  nameTour: {
    type: String,
    required: false,
  },
  waypoints: {
    type: [String],
    default: undefined,
    required: true,
    unique: true,
  },
  tourDescription: {
    type: String,
    required: false,
  },
  mapsLink: {
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
