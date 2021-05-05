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
  ratingAmount: {
    five: { type: Number, default: 0 },
    four: { type: Number, default: 0 },
    three: { type: Number, default: 0 },
    two: { type: Number, default: 0 },
    one: { type: Number, default: 0 },
  },
  totalRating: {
    type: Number,
    required: false,
    default: 0,
  },
  duration: {
    type: String,
  },
});

// Access to this file
module.exports = Tour = mongoose.model("tour", TourSchema);
