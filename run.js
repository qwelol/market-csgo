const moduleMarket = require('./module/MarketCsgo.js');
const moduleAuth = require("./module/Auth");
const SteamAuth = require("steamauth");

const key = process.argv[2]; //Получить ключ можно по ссылке: https://market.csgo.com/docs-v2
const percent = 0; // % снижение стоимости предмета 

console.log("key",key,"percent",percent);

//log to guard
let auth = moduleAuth.getAuth("log");
auth.login({
	username:"log",
	password:"pass"
}, function(err, session)
{
	if (err) throw err;
});

// const market = new moduleMarket.getMarket(key, percent, 
// 	(msg, count) => {
//         console.log(msg, count)
// 		//massage(msg,count); отправляем сообщения в функцию
// 	}, 
// 	(trade) => {
//         console.log(JSON.stringify(trade, null, 2))
// 		//getTradeOffer(trade); отправляем трейд 
// 	}
// );
// market.StartOfSales();




// accepting trade
// auth.getTradeConfirmations(function(err, trades)
// {
// 	for (let i=0; i<trades.length; i++){
// 		auth.acceptTradeConfirmation(trades[i].id, trades[i].key, (err)=>{
// 			if (err) throw err;
// 		})
// 	}
// 	console.log("trades",trades);
// });