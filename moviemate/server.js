"use strict";
// create an API server
const Restify = require("restify");
const server = Restify.createServer({
  name: "MovieMate",
});
const tmdb = require("./tmdb");
const PORT = process.env.PORT || 3000;

server.use(Restify.jsonp());

// Tokens
const config = require("./config");

// FBeamer
const FBeamer = require("./fbeamer");
const f = new FBeamer(config.FB);

// Register the webhooks
server.get("/", (req, res, next) => {
  f.registerHook(req, res);
  return next();
});

// Receive all incoming messages
server.post(
  "/",
  (req, res, next) => f.verifySignature(req, res, next),
  Restify.bodyParser(),
  (req, res, next) => {
    f.incoming(req, res, (msg) => {
      // Process messages
      const { message, sender } = msg;

      if (message.text && message.nlp) {
        tmdb(message.nlp)
          .then((resp) => {
            f.txt(sender, resp.txt);
            if (resp.img) f.img(sender, resp.img);
          })
          .catch((err) => {
            console.log(err);
            f.txt(sender, "Sorry, some errors happened!");
          });
      }
    });
    return next();
  }
);

// Subscribe
f.subscribe();

server.listen(PORT, () => console.log(`MovieMate running on port ${PORT}`));
