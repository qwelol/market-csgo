const request = require("request"); //npm i request

module.exports.getRequest = function () {
  this.request = request;

  this._jsonLog = (obj) => {
    console.log(JSON.stringify(obj, null, 2)); //object object
  };
  this.loading = (url, callback) => {
    this.request(url, (error, response, body) => {
      if (response === null || response === undefined) {
        this._jsonLog(
          "LibratoMetrics.Error: Request failed without a response. Network Connected?"
        );
        return;
      }
      if (!error && response.statusCode == 200) {
        callback(JSON.parse(body));
      } else {
        this._jsonLog("error request:");
        this._jsonLog(error);
      }
    });
  };
};
