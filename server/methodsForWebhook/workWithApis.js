/* eslint-disable linebreak-style */
const axios = require("axios");
const key = process.env.GOOGLE_MAPS_APIKEY;

const hostGoogleApis = "https://maps.googleapis.com/maps/api";
const hostGoogleMaps = "https://www.google.com/maps";

const axiosUseGet = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const getPlaceFromUserFunc = async (waypoint) => {
  const uriFindPlace = `${hostGoogleApis}/place/findplacefromtext/json?input=${encodeURIComponent(
    waypoint
  )},Prague&inputtype=textquery&fields=place_id&key=${key}`;

  try {
    const json = await axiosUseGet(uriFindPlace);
    const placeId = json.candidates[0].place_id;

    if (json.status === "OK") {
      const uriPlaceDetails = `${hostGoogleApis}/place/details/json?place_id=${encodeURIComponent(
        placeId
      )}&fields=name,formatted_address,photo,url,website&key=${key}`;

      const jsonDetails = await axiosUseGet(uriPlaceDetails);
      let result = {};

      if (jsonDetails.result?.photos) {
        const photoReference1 = jsonDetails.result.photos[0].photo_reference;
        const photoReference2 = jsonDetails.result.photos[1].photo_reference;

        const uriGetPhotos1 = `${hostGoogleApis}/place/photo?maxwidth=400&photoreference=${photoReference1}&key=${key}`;
        const uriGetPhotos2 = `${hostGoogleApis}/place/photo?maxwidth=400&photoreference=${photoReference2}&key=${key}`;

        result = {
          status: jsonDetails.status,
          url: jsonDetails.result.url,
          name: jsonDetails.result.name,
          formatted_address: jsonDetails.result.formatted_address,
          website: jsonDetails.result.website,
          photo1: uriGetPhotos1,
          photo2: uriGetPhotos2,
        };
      } else {
        result = {
          status: jsonDetails.status,
          url: jsonDetails.result.url,
          name: jsonDetails.result.name,
          formatted_address: jsonDetails.result.formatted_address,
          website: jsonDetails.result.website,
        };
      }
      return result;
    }
  } catch (err) {
    console.error("error", err);
  }
};

const getOrderedWaypointsAndMapsLinkFunc = async (
  waypoints,
  travelMode,
  waypointsAllInfo
) => {
  const origin = waypoints[0] + ",Prague";
  const destination = waypoints[1] + ",Prague";
  let waypointsAllInfoOrdered = [];

  const changedArr = waypoints.slice(2);
  let stringToAdd = "";

  if (changedArr.length >= 1) {
    stringToAdd = changedArr.join(",Prague|") + ",Prague|";
  }

  const uriCreateDirections = `${hostGoogleApis}/directions/json?origin=${encodeURIComponent(
    origin
  )}&destination=${encodeURIComponent(destination)}&mode=${encodeURIComponent(
    travelMode
  )}&waypoints=optimize:true|${encodeURIComponent(
    stringToAdd
  )}&language=en&key=${key}`;

  try {
    const json = await axiosUseGet(uriCreateDirections);
    const waypointOrder = json.routes[0].waypoint_order;

    waypointsAllInfoOrdered.push(waypointsAllInfo[0]);
    if (waypointOrder.length !== 0) {
      for (let i = 0; i < waypointOrder.length; i++) {
        let elName = changedArr.find(
          (element, index) => index === waypointOrder[i]
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

    const googleMapsLinkDir = `${hostGoogleMaps}/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(
      destination
    )}&travelmode=${encodeURIComponent(
      travelMode
    )}&waypoints=${encodeURIComponent(stringToAdd)}`;

    const result = {
      status: json.status,
      waypointsAllInfoOrdered,
      googleMapsLinkDir,
    };
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getWikiInfoFunc = async (placeNameForWiki) => {
  let readyNameForWiki = placeNameForWiki.replace(" ", "-");

  if (!placeNameForWiki.includes("Prague", 0)) {
    readyNameForWiki += "-prague";
  }

  const urlWikiSearch = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&gsrsearch=${encodeURIComponent(
    readyNameForWiki
  )}&gsrlimit=1&prop=extracts|info&inprop=url&exsentences=4&explaintext=true&utf8=&format=json`;

  try {
    const json = await axiosUseGet(urlWikiSearch);
    let result = {};
    if (json.query !== undefined) {
      const pages = json.query.pages;
      const firstEl = pages[Object.keys(pages)[0]];
      const extract = firstEl.extract;
      const fullUrl = firstEl.fullurl;
      result = { status: "OK", extract, fullUrl };
    } else {
      result = { status: "NOT FOUND" };
    }
    return result;
  } catch (err) {
    console.log(err);
  }
};

const getNearbyPlacesFunc = async (location, categoryOfInterest) => {
  const uriFindPlace = `${hostGoogleApis}/place/findplacefromtext/json?input=${encodeURIComponent(
    location
  )},Prague&inputtype=textquery&fields=geometry&key=${key}`;

  try {
    const json = await axiosUseGet(uriFindPlace);
    const locationLat = json.candidates[0].geometry.location.lat;
    const locationLng = json.candidates[0].geometry.location.lng;
    const uriNearby = `${hostGoogleApis}/place/nearbysearch/json?location=${encodeURIComponent(
      locationLat
    )},${encodeURIComponent(
      locationLng
    )}&radius=1000&keyword=${encodeURIComponent(
      categoryOfInterest
    )}&key=${key}`;
    const jsonNearby = await axiosUseGet(uriNearby);
    let placesArray = [];

    for (let i = 0; i < jsonNearby.results.length; i++) {
      let findedPlace = jsonNearby.results[i];
      if (
        findedPlace?.business_status !== "OPERATIONAL" ||
        findedPlace?.opening_hours === undefined ||
        findedPlace?.opening_hours?.open_now === false
      ) {
        continue;
      }
      let openNow = "";
      let mapsUrl = `${hostGoogleMaps}/search/?api=1&query=${encodeURIComponent(
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
    const mapsUrlCategorySearch = `${hostGoogleMaps}/search/?api=1&query=${encodeURIComponent(
      categoryOfInterest
    )},prague`;
    const result = { placesArray, mapsUrlCategorySearch };
    return result;
  } catch (err) {
    console.error("error", err);
  }
};

module.exports = {
  getPlaceFromUserFunc,
  getOrderedWaypointsAndMapsLinkFunc,
  getWikiInfoFunc,
  getNearbyPlacesFunc,
};
