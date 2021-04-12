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
    const place = req.body.waypoint;
    const uri_find_place = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      place
    )},Prague&inputtype=textquery&fields=place_id&key=${key}`;

    try {
      const json = await axiosUseGet(uri_find_place);
      const placeId = json.candidates[0].place_id;
      if (json.status === "OK") {
        let uri_place_details = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
          placeId
        )}&fields=name,formatted_address,photo,url&key=${key}`;
        const json_details = await axiosUseGet(uri_place_details);
        if (json_details.result?.photos) {
          let photoReference1 = json_details.result.photos[0].photo_reference;
          let photoReference2 = json_details.result.photos[1].photo_reference;

          const uriGetPhotos1 = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference1}&key=${key}`;
          const uriGetPhotos2 = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference2}&key=${key}`;

          res.json({
            status: json_details.status,
            url: json_details.result.url,
            name: json_details.result.name,
            formatted_address: json_details.result.formatted_address,
            photo1: uriGetPhotos1,
            photo2: uriGetPhotos2,
          });
        } else {
          res.json({
            status: json_details.status,
            url: json_details.result.url,
            name: json_details.result.name,
            formatted_address: json_details.result.formatted_address,
          });
        }
      }
    } catch (err) {
      console.error("error", err);
    }
  } else if (req.body.finishSelectingPlaces === true) {
    let waypoints = req.body.waypoints;
    const travelMode = req.body.travelMode;
    let waypointsAllInfo = req.body.waypointsAllInfo;

    let origin = waypoints[0];
    let destination = waypoints[1];
    let waypointsAllInfoOrdered = [];

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
      const waypoint_order = json.routes[0].waypoint_order;
      waypointsAllInfoOrdered.push(waypointsAllInfo[0]);
      if (waypoint_order.length !== 0) {
        for (let i = 0; i < waypoint_order.length; i++) {
          let elName = changedArr.find(
            (element, index) => index === waypoint_order[i]
          );
          let elAllInfo = waypointsAllInfo.find((el) => el.name === elName);
          waypointsAllInfoOrdered.push(elAllInfo);
        }
      }
      waypointsAllInfoOrdered.push(waypointsAllInfo[1]);
      console.log(waypointsAllInfoOrdered);
      res.json({
        status: json.status,
        waypoint_order: json.routes[0].waypoint_order,
        waypointsAllInfoOrdered,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.body.getGoogleMapsLink === true) {
    const waypointsAllInfoOrdered = req.body.waypointsAllInfoOrdered;
    const travelMode = req.body.travelMode;

    const origin = waypointsAllInfoOrdered[0].name;
    const destination =
      waypointsAllInfoOrdered[waypointsAllInfoOrdered.length - 1].name;

    console.log(origin, destination);

    const nameTour = `${origin} - ${destination}`;

    console.log(`name : ${nameTour}`);

    let orderedWaypointsPart = [];
    let stringToAdd = "";

    // do right order of array el
    for (let i = 1; i < waypointsAllInfoOrdered.length - 1; i++) {
      orderedWaypointsPart.push(waypointsAllInfoOrdered[i].name);
    }
    console.log(orderedWaypointsPart);

    if (orderedWaypointsPart.length >= 1) {
      stringToAdd = orderedWaypointsPart.join(",Prague|") + ",Prague|";
    }
    console.log(stringToAdd);

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
    });
  } else if (req.body.getWikiInfo === true) {
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
