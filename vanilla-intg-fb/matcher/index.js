"use strict";

const patterns = require("../patterns");
const XRegExp = require("xregexp");

let createEntities = (str, pattern) => {
  return XRegExp.exec(str, XRegExp(pattern, "i"));
};

let matchPattern = (msg, cb) => {
  let matchedPattern = patterns.find((patObj) =>
    XRegExp.test(msg, XRegExp(patObj.pattern, "i"))
  );

  if (matchedPattern) {
    return cb({
      intent: matchedPattern.intent,
      entities: createEntities(msg, matchedPattern.pattern),
    });
  } else {
    return cb({});
  }
};

module.exports = matchPattern;
