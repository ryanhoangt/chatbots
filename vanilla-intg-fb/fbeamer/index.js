"use strict";

const crypto = require("crypto");
const request = require("request");

const API_VERSION = "v16.0";

class FBeamer {
  constructor({ pageAccessToken, verifyToken, appSecret }) {
    try {
      if (pageAccessToken && verifyToken) {
        this.pageAccessToken = pageAccessToken;
        this.verifyToken = verifyToken;
        this.appSecret = appSecret;
      } else {
        throw "Tokens/credentials are missing!";
      }
    } catch (err) {
      console.log(err);
    }
  }

  registerHook(req, res) {
    const params = req.query;
    const mode = params["hub.mode"],
      token = params["hub.verify_token"],
      challenge = params["hub.challenge"];

    try {
      if (mode && token && mode === "subscribe" && token === this.verifyToken) {
        console.log("Webhook registered!");
        return res.send(challenge);
      }
    } catch (err) {
      console.log(err);
      return res.sendStatus(200);
    }
  }

  verifySignature(req, res, buf) {
    return (req, res, buf) => {
      if (req.method === "POST") {
        try {
          let signature = req.headers["x-hub-signature"];
          if (!signature) {
            throw "Signature not received.";
          } else {
            let hash = crypto
              .createHmac("sha1", this.appSecret)
              .update(buf, "utf-8");

            if (hash.digest("hex") !== signature.split("=")[1]) {
              throw "Invalid signature!";
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
  }

  incoming(req, res, cb) {
    res.sendStatus(200);

    if (req.body.object === "page" && req.body.entry) {
      let data = req.body;
      //   console.log(data);
      data.entry.forEach((pageObj) => {
        if (pageObj.messaging) {
          pageObj.messaging.forEach((messageObj) => {
            if (messageObj.postback) {
              // TODO: handle postbacks
            } else {
              // TODO: handle messages
              return cb(this.messageHandler(messageObj));
            }
          });
        }
      });
    }
  }

  messageHandler(messageObj) {
    let sender = messageObj.sender.id;
    let message = messageObj.message;

    if (message.text) {
      let obj = {
        sender,
        type: "text",
        content: message.text,
      };

      return obj;
    }
  }

  _sendMessage(payload) {
    return new Promise((resolve, reject) => {
      request(
        {
          uri: `https://graph.facebook.com/${API_VERSION}/me/messages`,
          qs: {
            access_token: this.pageAccessToken,
          },
          method: "POST",
          json: payload,
        },
        (err, resp, body) => {
          if (!err && resp.statusCode === 200) {
            resolve({
              mid: body.message_id,
            });
          } else {
            reject(err);
          }
        }
      );
    });
  }

  txt(id, text, messaging_type = "RESPONSE") {
    let obj = {
      messaging_type,
      recipient: {
        id,
      },
      message: {
        text,
      },
    };

    return this._sendMessage(obj);
  }

  img(id, url, messaging_type = "RESPONSE") {
    let obj = {
      messaging_type,
      recipient: {
        id,
      },
      message: {
        attachment: {
          type: "image",
          payload: {
            url,
          },
        },
      },
    };

    return this._sendMessage(obj);
  }
}

module.exports = FBeamer;
