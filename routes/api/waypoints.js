const express = require("express");
const router = express.Router();

// Waypoint model to make queries
const Waypoint = require("../../models/waypoint");

// Creating routes

// @route  GET api/waypoints
// @desc   Get All Waypoints
// @access Public
// "/" represents api/waypoints endpoint
router.get("/", (req, res) => {
  Waypoint.find().then((waypoints) => res.json(waypoints));
});

// @route  POST api/waypoints
// @desc   Create An Waypoints
// @access Public
router.post("/", (req, res) => {
  const waypointName = req.body.name;
  Waypoint.findOne({ name: waypointName }, function (err, waypoint) {
    if (err) {
      console.log(err);
    }
    if (waypoint) {
      res.json({ status: "Waypoint already saved" });
    } else {
      // construct an object to insert into db
      // create newWaypoint in memory
      const newWaypoint = new Waypoint({
        name: req.body.name,
        place_id: req.body.place_id,
        formatted_address: req.body.formatted_address,
      });

      // save newWaypoint in db
      // give us back the waypoint that is saving
      newWaypoint
        .save()
        .then((waypoint) =>
          res.json({ status: "Waypoint saved in db", waypoint })
        )
        .catch((err) => console.log(err));
    }
  });
});

// @route  DELETE api/items
// @desc   DELETE An Item
// @access Public
router.delete("/:id", (req, res) => {
  Waypoint.findById(req.params.id)
    .then((waypoint) =>
      waypoint.remove().then(() => res.json({ success: true }))
    )
    .catch((err) => res.status(404).json({ success: false }));
});

// To access another file reads whats in there
module.exports = router;
