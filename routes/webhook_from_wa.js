const express = require("express");
const axios = require("axios");

const router = express.Router();
const key = process.env.GOOGLE_MAPS_APIKEY;

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
        )}&fields=name,formatted_address,photo,url,website&key=${key}`;
        const json_details = await axiosUseGet(uri_place_details);
        if (json_details.result?.photos) {
          const photoReference1 = json_details.result.photos[0].photo_reference;
          const photoReference2 = json_details.result.photos[1].photo_reference;

          const uriGetPhotos1 = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference1}&key=${key}`;
          const uriGetPhotos2 = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference2}&key=${key}`;

          res.json({
            status: json_details.status,
            url: json_details.result.url,
            name: json_details.result.name,
            formatted_address: json_details.result.formatted_address,
            website: json_details.result.website,
            photo1: uriGetPhotos1,
            photo2: uriGetPhotos2,
          });
        } else {
          res.json({
            status: json_details.status,
            url: json_details.result.url,
            name: json_details.result.name,
            formatted_address: json_details.result.formatted_address,
            website: json_details.result.website,
          });
        }
      }
    } catch (err) {
      console.error("error", err);
    }
  } else if (req.body.getOrderedWaypointsAndMapsLink === true) {
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

      let orderedWaypointsPart = [];
      let stringToAdd = "";

      // do right order of array el
      for (let i = 1; i < waypointsAllInfoOrdered.length - 1; i++) {
        orderedWaypointsPart.push(waypointsAllInfoOrdered[i].name);
      }
      if (orderedWaypointsPart.length >= 1) {
        stringToAdd = orderedWaypointsPart.join(",Prague|") + ",Prague|";
      }

      const googleMapsLinkDir = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
        origin
      )},Prague&destination=${encodeURIComponent(
        destination
      )},Prague&travelmode=${encodeURIComponent(
        travelMode
      )}&waypoints=${encodeURIComponent(stringToAdd)}`;

      res.json({
        status: json.status,
        waypointsAllInfoOrdered,
        googleMapsLinkDir,
      });
    } catch (err) {
      console.log(err);
    }
  } else if (req.body.getWikiInfo === true) {
    const placeNameForWiki = req.body.placeNameForWiki;
    const readyNameForWiki = placeNameForWiki.replace(" ", "-");
    let urlWikiSearch = "";
    if (placeNameForWiki.includes("Prague", 0)) {
      urlWikiSearch = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&gsrsearch=${encodeURIComponent(
        readyNameForWiki
      )}&gsrlimit=1&prop=extracts|info&inprop=url&exsentences=4&explaintext=true&utf8=&format=json`;
    } else {
      urlWikiSearch = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&gsrsearch=${encodeURIComponent(
        readyNameForWiki
      )}-prague&gsrlimit=1&prop=extracts|info&inprop=url&exsentences=4&explaintext=true&utf8=&format=json`;
    }

    try {
      const json = await axiosUseGet(urlWikiSearch);
      if (json.query !== undefined) {
        const pages = json.query.pages;
        const firstEl = pages[Object.keys(pages)[0]];
        const extract = firstEl.extract;
        const fullUrl = firstEl.fullurl;
        res.json({ status: "OK", extract, fullUrl });
      } else {
        res.json({ status: "NOT FOUND" });
      }
    } catch (err) {
      console.log(err);
    }
  } else if (req.body.getNearbyPlaces === true) {
    const location = req.body.location;
    const categoryOfInterest = req.body.categoryOfInterest;
    const uri_find_place = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      location
    )},Prague&inputtype=textquery&fields=geometry&key=${key}`;

    try {
      const json = await axiosUseGet(uri_find_place);
      const locationLat = json.candidates[0].geometry.location.lat;
      const locationLng = json.candidates[0].geometry.location.lng;
      const uri_nearby = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${encodeURIComponent(
        locationLat
      )},${encodeURIComponent(
        locationLng
      )}&radius=1000&keyword=${encodeURIComponent(
        categoryOfInterest
      )}&key=${key}`;
      const json_nearby = await axiosUseGet(uri_nearby);
      let placesArray = [];

      for (let i = 0; i < json_nearby.results.length; i++) {
        let findedPlace = json_nearby.results[i];
        if (
          findedPlace?.business_status !== "OPERATIONAL" ||
          findedPlace?.opening_hours === undefined ||
          findedPlace?.opening_hours?.open_now === false
        ) {
          continue;
        }
        let openNow = "";
        let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          findedPlace.name
        )},prague`;
        if (findedPlace?.opening_hours?.open_now === true) {
          openNow = "Open now";
        }
        let readyPlaceForResponse = {
          name: findedPlace.name,
          rating: findedPlace.rating,
          address: findedPlace.vicinity,
          mapsUrl,
          openNow,
        };
        placesArray.push(readyPlaceForResponse);
        if (placesArray.length === 3) {
          break;
        }
      }
      const mapsUrlCategorySearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        categoryOfInterest
      )},prague`;
      res.json({ placesArray, mapsUrlCategorySearch });
    } catch (err) {
      console.error("error", err);
    }
  }
});

const axiosUseGet = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

module.exports = router;
