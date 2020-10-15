const SteamID = require("steamid");
const request = require("request");

exports.createOffer = (sessionID, cookies, options) => {
  let { partner, token, tradeoffermessage, items } = options;
  let sid = new SteamID("[U:1:" + partner + "]");
  partner = sid.getSteamID64();

  const j = request.jar();
  const communityURL = "https://steamcommunity.com";
  cookies.forEach((name) => {
    j.setCookie(name, communityURL);
  });
  console.log("createOffer", partner, token, tradeoffermessage, items);
  request.post(
    {
      url: "https://steamcommunity.com/tradeoffer/new/send",
      jar: j,
      headers: {
        referer:
          "https://steamcommunity.com/tradeoffer/new/?partner=" +
          partner +
          "&token=" +
          token,
      },
      json: true,
      form: {
        sessionid: sessionID,
        serverid: 1,
        partner: partner,
        tradeoffermessage: tradeoffermessage,
        json_tradeoffer: JSON.stringify({
          newversion: true,
          version: 4,
          me: {
            assets: items,
            currency: [],
            ready: false,
          },
          them: {
            assets: [],
            currency: [],
            ready: false,
          },
        }),
        captcha: "",
        trade_offer_create_params: JSON.stringify({
          trade_offer_access_token: token,
        }),
        tradeofferid_countered: "",
      },
    },
    (err, response, body) => {
      if (response) {
        console.log("response", response.statusMessage, "body", body);
      }
    }
  );
};
