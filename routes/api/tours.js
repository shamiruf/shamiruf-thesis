const express = require("express");
const router = express.Router();
// Tour model to make queries
const Tour = require("../../models/tour");

// Creating routes
// @route  GET api/tours
// @desc   Get All Tours
// @access Public
router.get("/", (req, res) => {
  Tour.find()
    .then((tours) => res.json(tours))
    .catch((err) => {
      console.log(err);
    });
});

// @route  GET api/tours
// @desc   Get One Tour
// @access Public
router.get("/:nameTour", (req, res) => {
  Tour.findOne({ nameTour: req.params.nameTour })
    .then((tour) => {
      if (!tour) {
        return res.json({ status: "NOT FOUND" });
      }
      res.json(tour);
    })
    .catch((err) => {
      console.log(err);
    });
});

// @route  POST api/tours/updateRating
// @desc   Update Tour Rating
// @access Private
router.post("/updateRating", async (req, res) => {
  // console.log(JSON.stringify(req));
  const nameTour = { nameTour: req.body.nameTour };
  const totalRatingToSave = {
    totalRating: req.body.totalRating,
    ratingAmount: req.body.newRatingAmount,
  };
  Tour.findOneAndUpdate(nameTour, totalRatingToSave, {
    useFindAndModify: false,
  })
    .then(() => {
      res.json({ status: "Updated" });
    })
    .catch(() => res.status(404).json({ status: "Failed" }));
});

// @route  POST api/tours
// @desc   Create A Tour
// @access Private
router.post("/", (req, res) => {
  const waypoints = req.body.waypoints;
  Tour.findOne({ waypoints })
    .then((waypoints) => {
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
    })
    .catch((err) => {
      console.log(err);
    });
});

// @route  DELETE api/tours
// @desc   DELETE An Tour
// @access Private
router.delete("/:id", (req, res) => {
  Tour.findById(req.params.id)
    .then((tour) => tour.remove().then(() => res.json({ success: true })))
    .catch(() => res.status(404).json({ success: false }));
});

module.exports = router;
