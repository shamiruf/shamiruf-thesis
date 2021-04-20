#!/usr/bin/env
/**
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

require("dotenv").config({ silent: true });

// const express = require("express");
const path = require("path");

var server = require("./app");

// Serve static assets if in production
// if (process.env.NODE_ENV === "production") {
//   server.use(express.static("client/build"));
//   server.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }
var port = process.env.PORT || 5000;

server.listen(port, function () {
  // eslint-disable-next-line
  console.log("Server running on port: %d", port);
});
