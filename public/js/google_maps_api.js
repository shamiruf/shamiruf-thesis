const express = require("express");
const axios = require("axios");

const router = express.Router();
const key = process.env.GOOGLE_MAPS_APIKEY;

router.get("/", function (req, res) {
  res.send("Work with places and routes.");
});

router.post("/", async (req, res) => {
  if (req.body.getPlaceFromUser === true) {
    let place = req.body.waypoint;
    let uri_find_place = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      place
    )},Prague&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${key}`;
    try {
      const json = await axiosUse(uri_find_place);
      res.json({
        status: json.status,
        name: json.candidates[0].name,
        addres: json.candidates[0].formatted_address,
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
      const json = await axiosUse(uri_create_directions);
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

    let changedArr = waypoints.slice(2);

    let ordered_waypoints = [];
    let stringToAdd = "";

    for (let i = 0; i < changedArr.length; i++) {
      ordered_waypoints.push(changedArr[waypoint_order[i]]);
    }
    if (changedArr.length >= 1) {
      stringToAdd = ordered_waypoints.join(",Prague|") + ",Prague|";
    }

    const googleMapsLinkDir = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )},Prague&destination=${encodeURIComponent(
      destination
    )},Prague&travelmode=${encodeURIComponent(
      travelMode
    )}&waypoints=${encodeURIComponent(stringToAdd)}`;
    res.json({ status: "OK", googleMapsLinkDir });
  }
});

const axiosUse = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

module.exports = router;
