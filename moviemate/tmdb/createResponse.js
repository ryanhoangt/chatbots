"use strict";

module.exports = (intentName, movieObj, directorsStr) => {
  let { title, overview, release_date, poster_path } = movieObj;

  let releaseYear = release_date.slice(0, 4);

  if (intentName === "movieinfo") {
    let str = `${title} (${releaseYear}): ${overview}`.substring(0, 640);

    return {
      txt: str,
      img: `https://image.tmdb.org/t/p/w300/${poster_path}`,
    };
  } else if (intentName === "director") {
    let str =
      `${title} (${releaseYear}) was directed by ${directorsStr}.`.substring(
        0,
        640
      );

    return {
      txt: str,
    };
  }
};
