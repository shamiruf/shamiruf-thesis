/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
const axios = require("axios");

async function saveRatingInDb(response) {
  if (
    response.result.context.skills["main skill"].user_defined?.rating &&
    response.result.context.skills["main skill"].user_defined?.rating !== "" &&
    response.result.context.skills["main skill"].user_defined?.getRating ===
      true
  ) {
    let tourForRating =
      response.result.context.skills["main skill"].user_defined.tourFromDb[0];
    const ratingFromUser =
      response.result.context.skills["main skill"].user_defined.rating;
    const tourFromDbForRating = await findTourInDb(
      tourForRating.nameTour
    ).catch((err) => {
      console.log(err);
    });
    switch (ratingFromUser) {
      case "I really liked it!":
        tourFromDbForRating.ratingAmount.five += 1;
        break;
      case "Good!":
        tourFromDbForRating.ratingAmount.four += 1;
        break;
      case "Just fine":
        tourFromDbForRating.ratingAmount.three += 1;
        break;
      case "Not very good.":
        tourFromDbForRating.ratingAmount.two += 1;
        break;
      case "Bad.":
        tourFromDbForRating.ratingAmount.one += 1;
        break;
    }
    const newRatingAmount = tourFromDbForRating.ratingAmount;
    const totalAmount =
      tourFromDbForRating.ratingAmount.five +
      tourFromDbForRating.ratingAmount.four +
      tourFromDbForRating.ratingAmount.three +
      tourFromDbForRating.ratingAmount.two +
      tourFromDbForRating.ratingAmount.one;

    const totalRating =
      (5 * tourFromDbForRating.ratingAmount.five +
        4 * tourFromDbForRating.ratingAmount.four +
        3 * tourFromDbForRating.ratingAmount.three +
        2 * tourFromDbForRating.ratingAmount.two +
        1 * tourFromDbForRating.ratingAmount.one) /
      totalAmount;

    const objToSend = {
      nameTour: tourFromDbForRating.nameTour,
      totalRating: totalRating,
      newRatingAmount: newRatingAmount,
    };
    try {
      const linkLocal = "http://localhost:5000";
      const json = await axios
        .post(linkLocal + "/api/tours/updateRating", objToSend)
        .catch((err) => {
          console.log(err);
        });
      return JSON.stringify(json.status);
    } catch (err) {
      console.log(err);
    }
  }
}

async function findTourInDb(nameTour) {
  try {
    const linkLocal = "http://localhost:5000";
    const json = await axios
      .get(linkLocal + `/api/tours/${nameTour}`)
      .catch((err) => {
        console.log(err);
      });
    return json.data;
  } catch (err) {
    console.log(err);
  }
}

async function findWaypointsInDb(waypoints) {
  let waypointsAllInfoOrdered = [];
  if (waypoints) {
    for (let i = 0; i < waypoints.length; i++) {
      let placeName = waypoints[i];
      try {
        const linkLocal = "http://localhost:5000";
        const json = await axios
          .get(linkLocal + `/api/waypoints/${placeName}`)
          .catch((err) => {
            console.log(err);
          });
        waypointsAllInfoOrdered.push(json.data);
      } catch (err) {
        console.log(err);
      }
    }
    return waypointsAllInfoOrdered;
  }
}

module.exports = { saveRatingInDb, findTourInDb, findWaypointsInDb };
