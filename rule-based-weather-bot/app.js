"use strict";

const Readline = require("readline");
const rl = Readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const matcher = require("./matcher");
const weather = require("./weather");
const { currentWeather, forecastWeather } = require("./parser");

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (msg) => {
  matcher(msg, (data) => {
    switch (data.intent) {
      case "Hello":
        console.log(`${data.entities.greeting} to you too!`);
        rl.prompt();
        break;
      case "Exit":
        console.log("Have a great day!");
        process.exit(0);
      case "Current Weather":
        console.log(`Let me check...`);
        // get weather from API
        weather(data.entities.city)
          .then((response) => {
            let parsingResult = currentWeather(response);
            console.log(parsingResult);
          })
          .catch((err) => {
            console.log(
              "There are a problem connecting to the weather service!"
            );
          })
          .finally(() => {
            rl.prompt();
          });
        break;
      case "Weather Forecast":
        console.log("Let me check...");
        weather(data.entities.city)
          .then((response) => {
            let parsingResult = forecastWeather(response, data.entities);
            console.log(parsingResult);
          })
          .catch((err) => {
            console.log(
              "There are a problem connecting to the weather service!"
            );
          })
          .finally(() => {
            rl.prompt();
          });
        break;
      default:
        console.log("I don't know what you mean :(");
        rl.prompt();
    }
  });
});
