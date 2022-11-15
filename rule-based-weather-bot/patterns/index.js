const patternDict = [
  {
    pattern: "\\b(?<greeting>Hi|Hello|Hey)\\b",
    intent: "Hello",
  },
  {
    pattern: "\\b(bye|exit)\\b",
    intent: "Exit",
  },
  {
    pattern: "\\blike\\sin\\s\\b(?<city>.+)\\b",
    intent: "Current Weather",
  },
  {
    pattern:
      "\\b(?<weather>rain|rainy|sunny|cloudy|misty|foggy|drizzle|snow|snowy)\\b\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)\\b(?<time>day after tomorrow|tomorrow|today)$",
    intent: "Weather Forecast",
  },
  {
    pattern:
      "\\b(?<weather>rain|rainy|sunny|cloudy|misty|foggy|drizzle|snow|snowy)\\b\\s\\b(?<time>day after tomorrow|tomorrow|today)\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)$",
    intent: "Weather Forecast",
  },
];

module.exports = patternDict;
