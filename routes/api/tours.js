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
  // construct an object to insert into db
  // create newTour in memory

  const newTour = new Tour({
    nameTour: req.body.name,
  });

  // save newTour in db
  // give us back the tour that is saving
  newTour.save().then((tour) => res.json(tour));
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
