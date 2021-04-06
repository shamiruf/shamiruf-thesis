const express = require("express");
const axios = require("axios");

const router = express.Router();
const key = process.env.GOOGLE_MAPS_APIKEY;
const appBase = process.env.APP_BASE;
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

      if (json.status === "OK") {
        const payload = {
          place_id: json.candidates[0].place_id,
          name: json.candidates[0].name,
          formatted_address: json.candidates[0].formatted_address,
        };
        // save in db if place finded
        try {
          const linkApp = appBase;
          const linkLocal = "http://localhost:3000";
          const jsonFromDb = await axiosUsePost(
            linkApp + "/api/waypoints",
            payload
          );
          console.log({ status: jsonFromDb.status });
        } catch (err) {
          console.error("error", err);
        }
        res.json({
          status: json.status,
          place_id: json.candidates[0].place_id,
          name: json.candidates[0].name,
          formatted_address: json.candidates[0].formatted_address,
        });
      } else {
        res.json({ status: json.status });
      }
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

    // send googleMapsLinkDir
    res.json({ status: "OK", googleMapsLinkDir });
  } else if (req.body.saveInDB === true) {
    // save waypoint
    if (req.body.webhook_result_2.status === "OK") {
      const payload = {
        place_id: req.body.webhook_result_2.place_id,
        name: req.body.webhook_result_2.name,
        formatted_address: req.body.webhook_result_2.formatted_address,
      };
      try {
        const link = appBase || "http://localhost:3000";
        const json = await axiosUsePost(link + "api/waypoints", payload);
        res.json({ status: json.status });
      } catch (err) {
        console.error("error", err);
      }
    }
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

const axiosUsePost = async (url, payload) => {
  const response = await axios.post(url, payload);
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
