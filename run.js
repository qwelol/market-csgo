const moduleMarket = require('./module/MarketCsgo.js');

const key = process.argv[2]; //Получить ключ можно по ссылке: https://market.csgo.com/docs-v2
const percent = 0; // % снижение стоимости предмета 

console.log("key",key,"percent",percent);

const market = new moduleMarket.getMarket(key, percent, 
	(msg, count) => {
        console.log(msg, count)
		//massage(msg,count); отправляем сообщения в функцию
	}, 
	(trade) => {
        console.log(JSON.stringify(trade, null, 2))
		//getTradeOffer(trade); отправляем трейд 
	}
);
market.StartOfSales();