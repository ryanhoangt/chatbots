"use strict";

const request = require("request");
const TMDB = require("../config").TMDB;
const createResponse = require("./createResponse");

const MIN_CONFIDENCE = 0.8;

const extractEntity = (nlpObj, entityName) => {
  let entitiyObj = nlpObj["entities"][entityName + ":" + entityName];

  if (entitiyObj) return entitiyObj[0]["body"];
  else return null;
};

const extractIntent = (nlpObj) => {
  let intentsArr = nlpObj["intents"];
  if (intentsArr.length === 0) return null;

  let intent = intentsArr[0];
  if (intent["confidence"] > MIN_CONFIDENCE) return intent["name"];
  return null;
};

const getMovieData = (movie, releaseYear) => {
  let qs = {
    api_key: TMDB,
    query: movie,
  };

  if (releaseYear) {
    qs.year = Number(releaseYear);
  }

  return new Promise((resolve, reject) => {
    request(
      {
        uri: "https://api.themoviedb.org/3/search/movie",
        qs,
      },
      (err, resp, body) => {
        if (!err && resp.statusCode === 200) {
          let data = JSON.parse(body);
          resolve(data.results[0]);
        } else {
          reject(err);
        }
      }
    );
  });
};

const getDirector = (movieId) => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        qs: {
          api_key: TMDB,
        },
      },
      (err, resp, body) => {
        if (!err && resp.statusCode === 200) {
          let crews = JSON.parse(body).crew;
          let directors = crews
            .filter((item) => item.job === "Director")
            .map((item) => item.name)
            .join(", ");

          resolve(directors);
        } else {
          reject(err);
        }
      }
    );
  });
};

module.exports = (nlpData) => {
  return new Promise(async (resolve, reject) => {
    let intentName = extractIntent(nlpData);

    if (!intentName) {
      resolve({
        txt: "I'm not sure I understand you!",
      });
    }

    let movieEntity = extractEntity(nlpData, "movie");
    let releaseYearEntity = extractEntity(nlpData, "releaseYear");

    // console.log("intent name:", intentName);
    // console.log("entities:", movieEntity, releaseYearEntity);

    try {
      let movieData = await getMovieData(movieEntity, releaseYearEntity);
      let directorData = await getDirector(movieData.id);

      let response = createResponse(intentName, movieData, directorData);

      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
};
