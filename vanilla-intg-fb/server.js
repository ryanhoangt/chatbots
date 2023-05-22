"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const FBeamer = require("./fbeamer");

// Weather module
const matcher = require("./matcher");
const weather = require("./weather");
const { currentWeather, forecastWeather } = require("./parser");

const server = express();

const PORT = process.env.PORT || 3000;

const f = new FBeamer(config.fb);

server.get("/", (req, res) => {
  f.registerHook(req, res);
});

server.post(
  "/",
  bodyParser.json({
    verify: f.verifySignature.call(f),
  })
);

server.post("/", (req, res, next) => {
  // TODO:
  return f.incoming(req, res, async (data) => {
    try {
      //   if (data.content === "Hi") {
      //     await f.txt(data.sender, "Hey from vanilla!");
      //     await f.img(
      //       data.sender,
      //       "https://images.unsplash.com/photo-1684528905602-236109cf45c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
      //     );
      //   }

      if (data.type === "text") {
        matcher(data.content, async (resp) => {
          switch (resp.intent) {
            case "Hello":
              await f.txt(data.sender, `${resp.entities.greeting} to you too!`);
              break;
            case "Current Weather":
              await f.txt(data.sender, "Let me check...");
              let cwData = await weather(resp.entities.city);
              let cwResult = currentWeather(cwData);
              await f.txt(data.sender, cwResult);
              break;
            case "Weather Forecast":
              await f.txt(data.sender, "Let me check...");
              let wfData = await weather(resp.entities.city);
              let wfResult = forecastWeather(wfData);
              await f.txt(data.sender, wfResult);
              break;
            default:
              await f.txt(data.sender, "Sorry, I don't know what you mean :(");
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
});

server.listen(PORT, () => {
  console.log(`FBeamer Bot Service running on port ${PORT}`);
});
