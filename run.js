const moduleMarket = require('./module/MarketCsgo.js');

const key = 'M85bZ8hPufeqwf23f4j71irw29GEp'; //Получить ключ можно по ссылке: https://market.csgo.com/docs-v2
const percent = 1; // % снижение стоимости предмета 

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