# Модуль для продажи предметов игры "CS:GO" на market.csgo.com

### Задачи:
* Создания модуля очереди "Queue" для избежания получения бан за превышении лимита запросов в секунду.
* Создания модуля "Request" для отправки запросов.
* Создание модуля "MarketCsgo" для продажи скинов.
* Модуль "MarketCsgo" принимает "api key" и "%". После запуска модуля, каждый час снижается стоимость выставленных предметов на продажу, на указанный "%"

### Необходимые модули Node.js:
* [queue](https://www.npmjs.com/package/queue) (npm i queue)
* [request](https://www.npmjs.com/package/request) (npm i request)

### Автор:
* Кирилл Самылин

#### [Ссылка api библиотеку market.csgo.com](https://market.csgo.com/docs-v2)
