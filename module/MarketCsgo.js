const moduleQueue = require('./Queue.js');
const queue = new moduleQueue.getQueue('market', 10000, 1, true); 
const moduleRequest = require('./Request.js');
const request = new moduleRequest.getRequest();

module.exports.getMarket = function(key, percent, msg, sendItems) {
	this._key = key;
	this._percent = percent;
	this._msg = msg;
	this._balance = 0; //Баланс
	this._sendItems = sendItems;
	
	//Логи.
	this._JsonLog = (obj) => {
		console.log(JSON.stringify(obj, null, 2))
	}
	//обновляем инвентарь
	this._UpdateInventory = () => {
		request.loading('https://market.csgo.com/api/UpdateInventory/?key='+this._key, (data) => {
			this._JsonLog(data);
		});
	}
	//Изменение цены.
	this._GetChangePrice = (id, cost) => {
		queue.queuePush((cb) => { 
			const newPrice = (cost>100) ? Math.round((cost*(1-this._percent/100)))*100 : (cost-1)*100;
			request.loading('https://market.csgo.com/api/v2/set-price?key='+this._key+'&item_id='+id+'&price='+newPrice+'&cur=RUB', (data) => {
				this._JsonLog(id+':цена снижена на '+this._percent+'% | ' + cost +'-'+newPrice/100);
				this._JsonLog(data);
			})
		})
	}
	//Запрос на предметы, которые выставлены на продажу.
	this._GetItems = () => {
		request.loading('https://market.csgo.com/api/v2/items?key='+this._key, (data) => {
			if (data.success && data.items && data.items.length>0) {
				data.items.forEach((item) => {
					this._GetChangePrice(item.item_id,Math.round(item.price));
				})
			}
		})
	}
	//Баланс
	this._GetMoney = () => {
		request.loading('https://market.csgo.com/api/GetMoney/?key='+this._key, (data) => {
			if (data.money!=this._balance && !Number.isNaN(data.money)) {
				this._balance = data.money;
				this._msg('Денежный баланс на сайте: ' + Math.floor(data.money/100), 0);
			}
		})
	}
	// Выставляем предмет на продажу
	this._SetPrice = (id,cost) => {
		request.loading('https://market.csgo.com/api/v2/add-to-sale?key='+this._key+'&id='+id+'&price='+cost*100+'&cur=RUB', (data) => {
			if (data.success) {
				this._JsonLog('Предмет '+id+' выставлен на продажу за ' +cost+'руб.');
			} else {
				if (data.error=='bad_input') {
					this._JsonLog('Не верно указаны параметры');
				}
				if (data.error=='inventory_not_loaded') {
					this._JsonLog('необходимо обновить инвентарь');
					this._UpdateInventory();
				}
				if (data.error=='item_not_recieved') {
					this._JsonLog('необходимо обновить инвентарь');
					this._UpdateInventory();
				}
				if (data.error=='no_description_found') {
					this._JsonLog('Steam не вернул описание предмета '+id+' попробуйте позже');
				}
				if (data.error=='item_not_inserted') {
					this._JsonLog('Не удалось выставить '+id+' на продажу');
				}
				if (data.error=='item_not_in_inventory') {
					this._JsonLog('Предмет '+id+' не найден в инвентаре, попробуйте сначала обновить его с помощью метода UpdateInventory и подождать 10-20 секунд перед повторной попыткой.');
					this._UpdateInventory();
				}
				if (data.error=='bad_request') {
					this._JsonLog('Неверно указана цена или вообще не указана');
				}
			}
		})
	}
	//Узнаем цену предмета
	this._BuyOffers = (item) => {
		queue.queuePush((cb) => { 
			const name = item.market_hash_name;
			const encoded = encodeURI(name);
			this._JsonLog('start item to market: '+item.market_hash_name);
			
			request.loading('https://market.csgo.com/api/v2/get-list-items-info?key='+key+'&list_hash_name[]='+encoded, (data) => {
				if (data.success && data.data && data.data[name] && data.data[name].average) {
					const costItem = Math.round(data.data[name].average);
					this._JsonLog('Price item: '+name + ' | ' +costItem+ 'руб.');
					this._SetPrice(item.id, costItem);
				}
			})
		})
	}
	//Запрос на предметы в инвентаре, которые еще не выставили на продажу.
	this._GetInv = () => { 
		request.loading('https://market.csgo.com/api/v2/my-inventory/?key='+this._key, (data) => {
			if (data.success && data.items && data.items.length>0) {
				data.items.forEach((item) => {
					this._BuyOffers(item)
				})
			} else {
				this._UpdateInventory();
			}
		})
	}
	//Получить список предметов, которые были проданы и их необходимо передать боту
	this._GetItemsToGive = () => { 
		request.loading('https://market.csgo.com/api/v2/trade-request-give-p2p-all?key='+this._key, (data) => {
			if (data.success && data.offers && data.offers.length>0) {
				data.offers.forEach((offer) => {
					this._JsonLog(offer);
					this._sendItems(offer) //отправляем колбеком боту
				})
			}
		});	
	}
	// Тест, доступна продажа или нет
	this._Test = () => {	
		request.loading('https://market.csgo.com/api/v2/test?key='+this._key, (data) => {
			if (data.success && data.status.user_token && data.status.trade_check && data.status.site_online && data.status.site_notmpban) {
				this._JsonLog('All status "true", go function GetInv()');
				this._GetInv(); //
				this._GetItemsToGive(); //Смотрим есть ли проданные предметы
			}
		});
	}
	// Ставим статус ONLINE
	this._Online = () => {
		request.loading('https://market.csgo.com/api/v2/ping?key='+this._key, (data) => {
			if (data.success) {
				this._JsonLog('BOT CSGOTM ONLINE');
			} else {
				this._JsonLog(data);
				if (data.message=='too early for pong') {
					this._JsonLog('PING: NO TIME - START function Test');
					this._Test();
					return;
				}
				if (!data.success) {
					this._JsonLog(data.message);
					if (data.description) {
						this._msg(data.description,0); // возможно бот забанен отправляем сообщение.
					}
				}
			}
		})
	}
	//запускаем продажу
	this.StartOfSales = () => {
		this._JsonLog('start sales');
		setInterval(this._Online,120000); //Ставим статус онлайн
		setInterval(this._GetMoney,300000); // Смотрим баланс
		setInterval(this._GetItems,3600000); //раз в час - % от цены
	}
}