const fs = require("fs");
const SteamCommunity = require("steamcommunity");
const SteamTotp = require("steam-totp");
const moduleQueue = require("./Queue.js");
const queue = new moduleQueue.getQueue("confirmations", 10000, 1, true);

module.exports.getAuth = function (username) {
  this._username = username;
  this._loggedIn = false;
  this._shared_secret = null;
  this._identity_secret = null;
  this._community = null;
  this.acceptConfirmations = () => {
    //confirmation
    let time = parseInt((new Date().getTime() / 1000).toFixed(0));
    let keyTTP = SteamTotp.getConfirmationKey(
      this._identity_secret,
      time,
      "conf"
    );
    if (this._loggedIn) {
      this._community.getConfirmations(time, keyTTP, (err, confirmations) => {
        if (err) console.log(err);
        if (confirmations && confirmations.length) {
          console.log("confirmations", confirmations);
          for (let i = 0; i < confirmations.length; i++) {
            queue.queuePush(() => {
              this._community.acceptConfirmationForObject(
                this._identity_secret,
                confirmations[i].offerID,
                (err) => {
                  if (err) console.log(err);
                }
              );
            });
          }
        }
      });
    }
  };

  this.calculateCode = () => {
    return SteamTotp.getAuthCode(this._shared_secret);
  };

  this.setCookies = (cookies) => {
    this._community.setCookies(cookies);
    this._community.loggedIn((err, loggedIn) => {
      if (err) throw err;
      this._loggedIn = loggedIn;
      if (!loggedIn) throw new Error("Module market are not logged in");
    });
  };

  let data = [];
  let usr = null;
  let dir = "./mafiles";
  //get files
  let files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + "/" + files[i];
    if (fs.statSync(name).isFile() && /\.maFile$/.test(name)) {
      //parse files to json
      data.push(JSON.parse(fs.readFileSync(name, "utf8")));
    }
  }
  if (!data.length) throw new Error("Отсутствуют maFile");
  // console.log("data", data);
  // find file to current this._username
  for (let i = 0; i < data.length; i++) {
    if (data[i].account_name === this._username) {
      usr = data[i];
    }
  }
  if (!usr) throw new Error("Не найден maFile для " + this._username);
  // console.log("usr", usr);
  // create auth for current usr
  const { shared_secret, identity_secret } = usr;
  this._shared_secret = shared_secret;
  this._identity_secret = identity_secret;
  this._community = new SteamCommunity();
  console.log("auth config");
};
