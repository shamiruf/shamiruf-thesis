/**
 *
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var express = require("express"); // app server
const mongoose = require("mongoose"); // database
// var bodyParser = require("body-parser"); // parser for post requests
const axios = require("axios");

var AssistantV2 = require("ibm-watson/assistant/v2"); // watson sdk
const {
  IamAuthenticator,
  BearerTokenAuthenticator,
} = require("ibm-watson/auth");

var app = express();

const tours = require("./routes/api/tours");
const waypoints = require("./routes/api/waypoints");

const places = require("./routes/api/webhook_from_wa");
const tour = require("./models/tour");

// Connect to mongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(`MongoDB connected`))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Bootstrap application settings
app.use(express.static("./public")); // load UI from public folder
// app.use(bodyParser.json());
app.use(express.json());

// endpoints for db scheme
app.use("/api/tours", tours);
app.use("/api/waypoints", waypoints);

// endpoint for request from Watson (webhook)
app.use("/myplaces", places);

// Create the service wrapper
let authenticator;
if (process.env.ASSISTANT_IAM_APIKEY) {
  authenticator = new IamAuthenticator({
    apikey: process.env.ASSISTANT_IAM_APIKEY,
  });
} else if (process.env.BEARER_TOKEN) {
  authenticator = new BearerTokenAuthenticator({
    bearerToken: process.env.BEARER_TOKEN,
  });
}

var assistant = new AssistantV2({
  version: "2019-02-28",
  authenticator: authenticator,
  url: process.env.ASSISTANT_URL,
  disableSslVerification:
    process.env.DISABLE_SSL_VERIFICATION === "true" ? true : false,
});

// Endpoint to be call from the client side
app.post("/api/message", async function (req, res) {
  let assistantId = process.env.ASSISTANT_ID || "<assistant-id>";
  if (!assistantId || assistantId === "<assistant-id>") {
    return res.json({
      output: {
        text:
          "The app has not been configured with a <b>ASSISTANT_ID</b> environment variable. Please refer to the " +
          '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' +
          "Once a workspace has been defined the intents may be imported from " +
          '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.',
      },
    });
  }

  var textIn = "";
  let context = {};

  if (req.body) {
    if (req.body.input) {
      textIn = req.body.input.text;
    }
    if (req.body.context) {
      context = req.body.context;
      // To get tour from db
      if (
        context.skills["main skill"]?.user_defined?.tourFromDb?.length === 0
      ) {
        try {
          const tourObj = await findTourInDb(textIn);
          const waypoints = tourObj.waypoints;
          const waypointsAllInfoOrdered = await findWaypointsInDb(waypoints);
          context.skills["main skill"].user_defined.tourFromDb.push(tourObj);
          context.skills[
            "main skill"
          ].user_defined.waypointsAllInfoOrdered = waypointsAllInfoOrdered;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  var payload = {
    assistantId: assistantId,
    sessionId: req.body.session_id,
    input: {
      message_type: "text",
      text: textIn,
      options: {
        return_context: true,
      },
    },
    context: context,
  };

  // Send the input to the assistant service
  assistant.message(payload, function (err, data) {
    if (err) {
      const status = err.code !== undefined && err.code > 0 ? err.code : 500;
      return res.status(status).json(err);
    }
    saveInDb(data);
    // const responseAfterProcess = processResponse(data);
    if (data.result) return res.json(data);
  });
});

app.get("/api/session", function (req, res) {
  assistant.createSession(
    {
      assistantId: process.env.ASSISTANT_ID || "{assistant_id}",
    },
    function (error, response) {
      if (error) {
        return res.send(error);
      } else {
        return res.send(response);
      }
    }
  );
});

async function saveInDb(response) {
  if (
    response.result.context.skills["main skill"].user_defined?.webhook_result_6
      ?.status === "OK"
  ) {
    const tourFromWatson =
      response.result.context.skills["main skill"].user_defined
        .webhook_result_6;
    const waypoints = response.result.context.skills[
      "main skill"
    ].user_defined.webhook_result_5.waypointsAllInfoOrdered.map(
      (placeObj) => placeObj.name
    );
    const tourToSave = {
      nameTour: tourFromWatson.nameTour,
      mapsLink: tourFromWatson.googleMapsLinkDir,
      waypoints,
    };
    try {
      const linkLocal = "http://localhost:5000";
      const json = await axios.post(linkLocal + "/api/tours", tourToSave);
      return JSON.stringify(json.status);
    } catch (err) {
      console.log(err);
    }
  } else if (
    response.result.context.skills["main skill"].user_defined?.rating &&
    response.result.context.skills["main skill"].user_defined?.rating !== "" &&
    response.result.context.skills["main skill"].user_defined?.tourFromDb[0] !==
      {}
  ) {
    let tourForRating =
      response.result.context.skills["main skill"].user_defined.tourFromDb[0];
    const ratingFromUser =
      response.result.context.skills["main skill"].user_defined.rating;
    const tourFromDbForRating = await findTourInDb(tourForRating.nameTour);
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
      const json = await axios.post(
        linkLocal + "/api/tours/updateRating",
        objToSend
      );
      return JSON.stringify(json.status);
    } catch (err) {
      console.log(err);
    }
  }
}

async function findTourInDb(nameTour) {
  try {
    const linkLocal = "http://localhost:5000";
    const json = await axios.get(linkLocal + `/api/tours/${nameTour}`);
    return json.data;
  } catch (err) {
    console.log(err);
  }
}

async function findWaypointsInDb(waypoints) {
  let waypointsAllInfoOrdered = [];
  for (let i = 0; i < waypoints.length; i++) {
    let placeName = waypoints[i];
    try {
      const linkLocal = "http://localhost:5000";
      const json = await axios.get(linkLocal + `/api/waypoints/${placeName}`);
      waypointsAllInfoOrdered.push(json.data);
    } catch (err) {
      console.log(err);
    }
  }
  return waypointsAllInfoOrdered;
}

module.exports = app;
