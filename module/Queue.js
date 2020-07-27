const queue = require('queue');
module.exports.getQueue = function(name, time, concurrency, autostart) {
	
	this.itemLocation = queue();
	this.itemLocation.concurrency = concurrency;
	this.itemLocation.customName = name;
	this.itemLocation.timeout = time;
	this.itemLocation.autostart = autostart;
	
	this._unixTime = () => {
		return (+new Date()/1000);
	}
	
	this.queuePush = (callback) => {
		if (!this.itemLocation.sessionId) {
			this.itemLocation.sessionId = 0;
			this.itemLocation.on('timeout', (next, job) => {
				let objInfo = job('objInfo');
				objInfo.timeout = true;
				next();
			});
		}
		
		this.itemLocation.sessionId++;

		let objInfo = {
			sessionTime : this._unixTime(),
			sessionId : this.itemLocation.sessionId,
			customName : this.itemLocation.customName,
			timeout: false,
			getTime: () => {
				let s =
				'[' + Math.round(this._unixTime()) + '] ' +
				'exQueuePush('+this.customName+')' +
				' id:' + this.sessionId +
				' time:' + Math.round(this.getTimeout()) +
				' qlen:' + this.itemLocation.length;
				return s;
			},
			getTimeout: () => {
				return (this._unixTime() - this.sessionTime);
			}
		};
		this.itemLocation.push((cb) => {
			if (cb === 'objInfo') {
				return objInfo;
			}
			objInfo.sessionTime = this._unixTime();
			callback(() => {
				if (objInfo.timeout === false) {
					cb();
				}
			});
		});
	}
}