const SteamUser = require("steam-user");
const moduleMarket = require("./module/MarketCsgo.js");
const moduleAuth = require("./module/Auth");
const { createOffer } = require("./module/Offers");
const moduleQueue = require("./module/Queue.js");
const queue = new moduleQueue.getQueue("offers", 100000, 1, true);
const config = require("./config.json");

const {
  login,
  password,
  key,
  percent,
  changePriseInterval,
  addToSale,
  acceptingInterval,
  blacklist,
} = config;
console.log("key", key, "percent", percent);
try {
  //log to guard
  moduleAuth.getAuth(login);
} catch (err) {
  console.log("Не удалось выполнить вход \nПричина:", err.message);
  return 0;
}

let client = new SteamUser();

let logOnOptions = {
  accountName: login,
  password: password,
  twoFactorCode: moduleAuth.calculateCode(),
};
client.logOn(logOnOptions);

client.on("disconnected", (eresult, msg) => {
  console.log("Disconected from Steam because ", msg);
  return 0;
});

client.on("webSession", (sessionID, cookies) => {
  console.log("session", sessionID);
  moduleAuth.setCookies(cookies);
  const market = new moduleMarket.getMarket(
    key,
    percent,
    changePriseInterval,
    addToSale,
    blacklist,
    (msg, count) => {
      console.log(msg, count);
      //massage(msg,count); отправляем сообщения в функцию
    },
    (trade) => {
      // console.log(JSON.stringify(trade, null, 2));
      //getTradeOffer(trade); отправляем трейд
      try {
        queue.queuePush(()=>{createOffer(sessionID, cookies, trade)});
      } catch (e) {
        console.log("Faled to create offer because ", e.message);
      }
    }
  );
  setInterval(moduleAuth.acceptConfirmations, acceptingInterval*1000);
  market.StartOfSales();
});
