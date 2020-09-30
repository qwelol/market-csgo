const SteamUser = require("steam-user");
const moduleMarket = require("./module/MarketCsgo.js");
const moduleAuth = require("./module/Auth");
const { createOffer } = require("./module/Offers");
const config = require("./config.json");

const {
  login,
  password,
  key,
  percent,
  changePriseInterval,
  blacklist,
} = config;
console.log("key", key, "percent", percent);

try {
  //log to guard
  moduleAuth.getAuth(login, password);
} catch (err) {
  console.log("Не удалось выполнить вход \nПричина:", err.message);
}

let client = new SteamUser();

let logOnOptions = {
  accountName: login,
  password: password,
  twoFactorCode: moduleAuth.calculateCode(),
};
client.logOn(logOnOptions);

client.on("webSession", (sessionID, cookies) => {
  console.log("session", sessionID);
  const market = new moduleMarket.getMarket(
    key,
    percent,
    changePriseInterval,
    blacklist,
    (msg, count) => {
      console.log(msg, count);
      //massage(msg,count); отправляем сообщения в функцию
    },
    (trade) => {
      // console.log(JSON.stringify(trade, null, 2));
      //getTradeOffer(trade); отправляем трейд
      try {
        createOffer(sessionID, cookies, trade, () => {
          moduleAuth.login(() => {
            setTimeout(moduleAuth.acceptConfirmation, 30000);
          });
        });
      } catch (e) {
        console.log("Faled to create offer because ", e.message);
      }
    }
  );
  market.StartOfSales();
});
