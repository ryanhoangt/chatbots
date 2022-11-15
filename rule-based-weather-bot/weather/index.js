"use strict";

const axios = require("axios");

const formatData = (data) => {
  return {
    location: `${data.location.name}, ${data.location.country}`,
    temperature: data.current.temperature,
    description: data.current.weather_descriptions.join(", "),
    code: data.current.weather_code,
  };
};

const getWeather = (location) => {
  return new Promise(async (resolve, reject) => {
    try {
      const weatherCondition = await axios.get(
        "http://api.weatherstack.com/current",
        {
          params: {
            access_key: "825a4df23196be30ea9ca59d841a74d8",
            query: location,
          },
        }
      );

      resolve(formatData(weatherCondition.data));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = getWeather;
