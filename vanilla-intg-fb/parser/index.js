"use strict";

const getFeel = (temp) => {
  if (temp < 5) {
    return "shivering cold";
  } else if (temp < 15) {
    return "pretty cold";
  } else if (temp < 25) {
    return "moderately cold";
  } else if (temp < 32) {
    return "quite warm";
  } else if (temp < 40) {
    return "very hot";
  } else {
    return "super hot";
  }
};

const currentWeather = (response) => {
  const { location, temperature, description } = response;

  return `Right now, it is ${description.toLowerCase()} in ${location}. It is ${getFeel(
    Number(temperature)
  )} at ${String(temperature)} degrees Celsius.`;
};

const forecastWeather = (response, entities) => {
  return "Sorry, forecast function is not supported by the API anymore.";
};

module.exports = {
  currentWeather,
  forecastWeather,
};
