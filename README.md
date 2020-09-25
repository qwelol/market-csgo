# Модуль для продажи предметов игры "CS:GO" на market.csgo.com

### Задачи:
* Создание модуля очереди "Queue", для избежания получения бана за превышение лимита запросов в секунду.
* Создание модуля "Request" для отправки запросов.
* Создание модуля "MarketCsgo" для продажи скинов.
* Модуль "MarketCsgo" принимает "api key" и "%". После запуска модуля, каждый час снижается стоимость выставленных предметов на продажу, на указанный "%"
* Модуль "Offers" осуществляет отправку предложения обмена через steam API
* Модуль "Auth" реализует функции аунтефикатора steam 

### Необходимые модули Node.js:
* [queue](https://www.npmjs.com/package/queue)
* [request](https://www.npmjs.com/package/request)
* [fs](https://www.npmjs.com/package/fs)
* [steamauth](https://www.npmjs.com/package/steamauth)
* [steam-user](https://www.npmjs.com/package/steam-user)
* [steamid](https://www.npmjs.com/package/steamid)

### Начало работы
1. Скопировать репозиторий
2. Установить необходимые модули
``` npm install ```
3. Указать данные от аккаунта в 
   ``` config.json ```
4. Перенести папку ```mafiles``` из SDA (даже если в ней несколько файлов - автоматически будет найден нужный)
5. Запусить бота с помощью 
```npm start```
### Авторы:
* Кирилл Самылин
* Damarus

#### [Ссылка на api библиотеку market.csgo.com](https://market.csgo.com/docs-v2)
