const express = require("express");

const router = express.Router();
const workWithApis = require("../methodsForWebhook/workWithApis");

router.get("/", function (req, res) {
  res.send("Work with places and routes.");
});

router.post("/", async (req, res) => {
  let result;
  if (req.body.getPlaceFromUser === true) {
    result = await workWithApis.getPlaceFromUserFunc(req.body.waypoint);
    res.json(result);
  } else if (req.body.getOrderedWaypointsAndMapsLink === true) {
    result = await workWithApis.getOrderedWaypointsAndMapsLinkFunc(
      req.body.waypoints,
      req.body.travelMode,
      req.body.waypointsAllInfo
    );
    res.json(result);
  } else if (req.body.getWikiInfo === true) {
    result = await workWithApis.getWikiInfoFunc(req.body.placeNameForWiki);
    res.json(result);
  } else if (req.body.getNearbyPlaces === true) {
    result = await workWithApis.getNearbyPlacesFunc(
      req.body.location,
      req.body.categoryOfInterest
    );
    res.json(result);
  }
});

module.exports = router;
