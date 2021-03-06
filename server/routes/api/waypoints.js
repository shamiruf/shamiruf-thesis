/* eslint-disable linebreak-style */
const express = require("express");
const router = express.Router();

// Waypoint model to make queries
const Waypoint = require("../../models/waypoint");

// Creating routes

// @route  GET api/waypoints
// @desc   Get All Waypoints
// @access Public
router.get("/", (req, res) => {
  Waypoint.find()
    .then((waypoints) => res.json(waypoints))
    .catch((err) => {
      console.log(err);
    });
});

// @route  GET api/waypoints
// @desc   Get One waypoint
// @access Public
router.get("/:name", (req, res) => {
  Waypoint.findOne({ name: req.params.name })
    .then((waypoint) => {
      if (!waypoint) {
        res.json({ status: "NOT FOUND" });
      }
      res.json(waypoint);
    })
    .catch((err) => {
      console.log(err);
    });
});

// @route  POST api/waypoints
// @desc   Create An Waypoints
// @access Public
router.post("/", (req, res) => {
  const waypointName = req.body.name;
  Waypoint.findOne({ name: waypointName })
    .then((waypoint) => {
      if (waypoint) {
        res.json({ status: "Waypoint already saved" });
      } else {
        // construct an object to insert into db
        // create newWaypoint in memory
        const newWaypoint = new Waypoint({
          name: req.body.name,
          formatted_address: req.body.formatted_address,
          url: req.body.url,
          photo1: req.body.photo1,
          photo2: req.body.photo2,
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
    })
    .catch(() => res.status(404).json({ success: false }));
});

// @route  DELETE api/items
// @desc   DELETE An Item
// @access Public
router.delete("/:id", (req, res) => {
  Waypoint.findById(req.params.id)
    .then((waypoint) =>
      waypoint.remove().then(() => res.json({ success: true }))
    )
    .catch(() => res.status(404).json({ success: false }));
});

// To access another file reads whats in there
module.exports = router;
