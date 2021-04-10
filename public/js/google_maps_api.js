const express = require("express");
const axios = require("axios");

const router = express.Router();
const key = process.env.GOOGLE_MAPS_APIKEY;
// const appBase = process.env.APP_BASE;
router.get("/", function (req, res) {
  res.send("Work with places and routes.");
});

router.post("/", async (req, res) => {
  if (req.body.getPlaceFromUser === true) {
    let place = req.body.waypoint;
    let uri_find_place = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      place
    )},Prague&inputtype=textquery&fields=place_id,formatted_address,name&key=${key}`;
    try {
      const json = await axiosUseGet(uri_find_place);
      res.json({
        status: json.status,
        place_id: json.candidates[0].place_id,
        name: json.candidates[0].name,
        formatted_address: json.candidates[0].formatted_address,
      });
    } catch (err) {
      console.error("error", err);
    }
  } else if (req.body.finishSelectingPlaces === true) {
    let waypoints = req.body.waypoints;
    let travelMode = req.body.travelMode;
    let origin = waypoints[0];
    let destination = waypoints[1];

    let changedArr = waypoints.slice(2);
    let stringToAdd = "";
    if (changedArr.length >= 1) {
      stringToAdd = changedArr.join(",Prague|") + ",Prague|";
    }

    let uri_create_directions = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origin
    )},Prague&destination=${encodeURIComponent(
      destination
    )},Prague&mode=${encodeURIComponent(
      travelMode
    )}&waypoints=optimize:true|${encodeURIComponent(
      stringToAdd
    )}&language=en&key=${key}`;
    try {
      const json = await axiosUseGet(uri_create_directions);
      res.json({
        status: json.status,
        waypoint_order: json.routes[0].waypoint_order,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.body.getGoogleMapsLink === true) {
    const waypoints = req.body.waypoints;
    const waypoint_order = req.body.waypoint_order;
    const travelMode = req.body.travelMode;

    const origin = waypoints[0];
    const destination = waypoints[1];

    const nameTour = `${origin} - ${destination}`;

    // arr without origin and destination
    let changedArr = waypoints.slice(2);

    let orderedWaypointsPart = [];
    let orderedWaypointsAll = [];
    let stringToAdd = "";

    // do right order of array el
    for (let i = 0; i < changedArr.length; i++) {
      orderedWaypointsPart.push(changedArr[waypoint_order[i]]);
    }

    if (changedArr.length >= 1) {
      stringToAdd = orderedWaypointsPart.join(",Prague|") + ",Prague|";
    }
    orderedWaypointsAll.push(origin, orderedWaypointsPart, destination);
    const orderedWaypoints = orderedWaypointsAll.flat();

    const googleMapsLinkDir = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )},Prague&destination=${encodeURIComponent(
      destination
    )},Prague&travelmode=${encodeURIComponent(
      travelMode
    )}&waypoints=${encodeURIComponent(stringToAdd)}`;

    // send googleMapsLinkDir and ordered waypoints
    res.json({
      status: "OK",
      nameTour,
      googleMapsLinkDir,
      orderedWaypoints,
    });
  } else if (req.body.startTour === true) {
    let waypoints = req.body.waypoints;
    let place = watpoints.shift();

    const uri_place_details = ``;

    try {
      const json = await axiosUse(uri_place_details);
      res.json({
        status: json.status,
      });
    } catch (err) {
      console.log(err);
    }
  }
});

const axiosUseGet = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

// {
//   "waypoints": [
//       "Namesti miru",
//       "prague castle",
//       "Vysehrad",
//       "dejvicka",
//       "charles bridge"
//   ],
//   "waypoint": "Namesti miru",
//   "getPlaceFromUser": false,
//   "finishSelectingPlaces": false,
//   "getGoogleMapsLink": true,
//   "travelMode": "bicycling",
//   "waypoint_order": [
//       1,
//       2,
//       0
//   ]
// }

module.exports = router;
