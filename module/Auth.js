const fs = require('fs');
const SteamAuth = require("steamauth");

module.exports.getAuth = function( login ) {

    let data = [];
    //get giles 
    //parse files to json
    data.push(JSON.parse(fs.readFileSync('./mafiles/76561198194582911.maFile', 'utf8')));
    // find file to current login
    let usr = data[0];
    // create auth for current usr
    const { shared_secret, device_id, identity_secret } = usr;
    const auth = new SteamAuth({
        deviceid:device_id,
        shared_secret,
        identity_secret
    });
    return auth;
}