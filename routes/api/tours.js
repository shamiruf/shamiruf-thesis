const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
// Tour model to make queries
const Tour = require("../../models/tour");

// Creating routes
// @route  GET api/tours
// @desc   Get All Tours
// @access Public
router.get("/", (req, res) => {
  // TODO
  // SORT BY RAITING
  Tour.find().then((tours) => res.json(tours));
});

// @route  GET api/tours
// @desc   Get One Tour
// @access Public
router.get("/:nameTour", (req, res) => {
  Tour.findOne({ nameTour: req.params.nameTour }, function (err, tour) {
    if (err) {
      console.log(err);
    }
    if (!tour) {
      res.json({ status: "NOT FOUND" });
    }
    res.json(tour);
  });
});

// @route  POST api/tours
// @desc   Create A Tour
// @access Private

// TODO
// ADD AUTH like 2 argument
router.post("/", (req, res) => {
  const waypoints = req.body.waypoints;
  Tour.findOne({ waypoints: waypoints }, function (err, waypoints) {
    if (err) {
      console.log(err);
    }
    if (waypoints) {
      res.json({ status: "Tour already saved" });
    } else {
      // construct an object to insert into db
      // create newTour in memory
      const newTour = new Tour({
        nameTour: req.body.nameTour,
        mapsLink: req.body.mapsLink,
        waypoints: req.body.waypoints,
        tourDescription: req.body.tourDescription,
      });

      /// save newTour in db
      // give us back the tour that is saving
      newTour
        .save()
        .then((tour) => res.json({ status: "Tour saved in db", tour }))
        .catch((err) => console.log(err));
    }
  });
});

// @route  DELETE api/tours
// @desc   DELETE An Tour
// @access Private

// TODO
// ADD AUTH like 2 argument
router.delete("/:id", (req, res) => {
  Tour.findById(req.params.id)
    .then((tour) => tour.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
