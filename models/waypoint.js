const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Waypoint
const WaypointSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  formatted_address: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  photo1: {
    type: String,
    required: false,
  },
  photo2: {
    type: String,
    required: false,
  },
});

// Access to this file
module.exports = Waypoint = mongoose.model("waypoint", WaypointSchema);
