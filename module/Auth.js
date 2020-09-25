const fs = require("fs");
const SteamAuth = require("steamauth");

module.exports.getAuth = async function (username, password) {
  this._username = username;
  this._password = password;

  this.login = (cb) => {
    if (this._auth) {
      this._auth.login(
        {
          username: this._username,
          password: this._password,
          twofactorcode: this._auth.calculateCode(),
        },
        function (err, session) {
          if (err) console.log(err);
          console.log("logged to guard");
          cb();
        }
      );
    }
  };

  this.acceptConfirmation = () => {
    //confirmation
    this._auth.getTradeConfirmations(function (err, trades) {
      if (err) console.log(err);
      if (trades) {
        for (let i = 0; i < trades.length; i++) {
          auth.acceptTradeConfirmation(trades[i].id, trades[i].key, (err) => {
            if (err) console.log(err);
          });
        }
      }
      console.log("trades", trades);
    });
  };

  this.calculateCode = () => {
    return this._auth.calculateCode();
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
  const { shared_secret, device_id, identity_secret } = usr;
  const auth = new SteamAuth({
    deviceid: device_id,
    shared_secret,
    identity_secret,
  });
  this._auth = auth;
  console.log("auth config");
};
