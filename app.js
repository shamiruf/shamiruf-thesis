/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
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

var AssistantV2 = require("ibm-watson/assistant/v2"); // watson sdk
const {
  IamAuthenticator,
  BearerTokenAuthenticator,
} = require("ibm-watson/auth");

var app = express();

const tours = require("./routes/api/tours");
const waypoints = require("./routes/api/waypoints");
const places = require("./routes/webhook_from_wa");
const workWithDb = require("./workWithDB");

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
        text: "Assistant Id not found",
      },
    });
  }
  let textIn = "";
  let context = {};
  if (req.body) {
    if (req.body.input) {
      textIn = req.body.input.text;
    }
    if (req.body.context) {
      context = req.body.context;
      // To get tour from db
      if (
        context?.skills["main skill"]?.user_defined?.findTourFromDb === true
      ) {
        try {
          const tourObj = await workWithDb.findTourInDb(textIn).catch((err) => {
            console.log(err);
          });
          const waypointsAllInfoOrdered = await workWithDb
            .findWaypointsInDb(tourObj.waypoints)
            .catch((err) => {
              console.log(err);
            });
          context.skills["main skill"].user_defined.tourFromDb.push(tourObj);
          context.skills["main skill"].user_defined.waypointsAllInfoOrdered =
            waypointsAllInfoOrdered;
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
    workWithDb.saveRatingInDb(data);
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

module.exports = app;
