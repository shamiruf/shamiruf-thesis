const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Waypoint
const WaypointSchema = new Schema({
  place_id: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  formatted_address: {
    type: String,
    required: false,
  },
  waypointDescription: {
    type: Array,
    required: false,
  },
  openHours: {
    type: Array,
    required: false,
  },
  waypointWeb: {
    type: String,
    required: false,
  },
  photos: {
    type: String,
    required: false,
  },
});

// Access to this file
module.exports = Waypoint = mongoose.model("waypoint", WaypointSchema);
