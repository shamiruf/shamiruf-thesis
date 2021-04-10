const express = require("express");
const router = express.Router();

// Tour model to make queries
const Tour = require("../../models/tour");

// Creating routes
// @route  GET api/tours
// @desc   Get All Tours
// @access Public
// "/" represents api/tours endpoint
router.get("/", (req, res) => {
  Tour.find().then((tours) => res.json(tours));
});

// @route  POST api/tours
// @desc   Create A Tour
// @access Public
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
        // mapsLink: req.body.googleMapsLinkDir,
        waypoints: req.body.waypoints,
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
// @access Public
router.delete("/:id", (req, res) => {
  Tour.findById(req.params.id)
    .then((tour) => tour.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

module.exports = router;
