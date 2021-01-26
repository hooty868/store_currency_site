# 外匯計算器
#### 個人side-project頁面，主要引入request套件以及MongoDB來設計實時外匯計算器，隨時計算自己手上的外幣有沒有賺爆了！
![首頁](https://media.giphy.com/media/09hV6Vr1h6XhMe1tZy/giphy.gif)
## 引入套件
[![npm version](https://img.shields.io/badge/npm-6.14.10-blue)](https://www.npmjs.org/)
[![MongoDB version](https://img.shields.io/badge/MongoDB-5.11-ff69b4)](https://github.com/Automattic/mongoose)
[![request version](https://img.shields.io/badge/request-passing-critical)](https://github.com/request/request)
[![Express version](https://img.shields.io/badge/version-V4.17-green)](https://github.com/expressjs/express)



## 主要功能
- 首頁可提供央行現實匯率資訊
- 首頁可新增購買外幣匯率與總值
- 並且實時計算總盈虧
- 可新增購買外幣資訊
- 可刪除購買外幣資訊

## 專案開啟方式


## 主頁
利用`express`使用restful-API去存取mongo-db的資料，並利用`request`去抓取最新匯率資料.
#### 步驟
* 引入必要的express,catchCurrency匯率抓取函式,導入express.Router()以及mongoose-model
* 利用`router`去偵測瀏覽器是否要get`‘/’`主頁
* 導航成功後在.then函式中等待catchCurrenc抓到資料後，利用`mongoose`去像資料庫抓去資料，並以_id倒序方式送出
* 把currencyFinal(catchCurrency)與todos(mongo-DB)的資料符合條件下合併並回傳至變數final
* 再把total利用final.map()去把所有的盈利計算累加並回傳
* 然後再利用res.render()傳入handlebar的'index',參數有兩個final,total

```js
// home.js
const express = require('express')
const catchCurrency = require('../../public/js/catchPrice')
const router = express.Router()
const Todo = require('../../models/todo')
router.get('/', (req, res) => {
  (async function () {
    try {
      const currencyFinal = await catchCurrency()
      Todo.find()
        .lean()
        .sort({ _id: 'desc' })
        .then(todos => {
          let final = []
          let total = 0
          final = todos.map(todo => {
            if (todo.name === '美金 (USD)') {
              const obj = {
                ...todo,
                ...currencyFinal[0]
              }
              return obj
            } else if (todo.name === '人民幣 (CNY)') {
              const obj = {
                ...todo,
                ...currencyFinal[1]
              }
              return obj
            }
          })
          final = final.map(currency => {
            const obj = {
              ...currency,
              profit: (currency.buyPrice / currency.exchange) * (currency.spot_bid - currency.exchange)
            }
            total += obj.profit
            return obj
          })
          total = Math.round(total)
          res.render('index', { final, total })
        })
        .catch(error => console.error(error))
    } catch (error) {
      console.log(error)
    }
  }())
})
```
#### 撰寫catchPrice.js檔去抓取匯率資訊
```js
const request = require("request") //安裝request套件
const cheerio = require("cheerio") //安裝cheerio套件
let requestData = () => {
  return new Promise((resolve, reject) => {
    let output = []
    request({
      url: "https://rate.bot.com.tw/xrt?Lang=zh-TW",// catch央行匯率網站的資訊
      method: "GET"
    }, function (error, response, body) {
      if (error || !body) {
        console.log('404錯誤');
        return;
      } else {
        const data = [];
        const $ = cheerio.load(body); //載入body
        const list = $(".table-bordered tbody tr"); //尋找 class -> tbody -> tr
        for (let i = 0; i < list.length; i++) {
          const currency = list.eq(i).find("[class='visible-phone print_hide']").text().replace(/\n/g, '').trim()
          const cash = list.eq(i).find("[class='rate-content-cash text-right print_hide']")
          const spot = list.eq(i).find("[class='rate-content-sight text-right print_hide hidden-phone']")
          const cash_bid = cash.eq(0).text()
          const cash_ask = cash.eq(1).text()
          const spot_bid = parseFloat(cash.eq(0).text())
          const spot_ask = parseFloat(cash.eq(1).text())
          data.push({ currency, cash_bid, cash_ask, spot_bid, spot_ask })
        }
        const currencyFinal = data.map(obj => {
          obj = {
            ...obj,
            date: new Date()
          }
          return obj
        }).filter(obj => {
          if (obj.currency === '人民幣 (CNY)') return obj
          else if (obj.currency === '美金 (USD)') return obj
        })
        return resolve(currencyFinal)
      }
    })
  })
}
```

## express Router 設計
* 引入`express.Router()`去讓express導航到router.use('/', home) --> 同時引入 home = require('./modules/home')
* 也可以讓express導航到其他頁面router.use('/currency', currency) --> 同時引入 currency = require('./modules/currency')
```js
// index.js
const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const currency = require('./modules/currency')
router.use('/', home)

router.use('/currency', currency)

module.exports = router
```
## Restful-API 設計
* 在新增資料時利用 -> 抓取req.body.name中的資料，利用Todo.create().then()寫入資料庫，然後在回轉到`/`頁面
* 在刪除資料時利用 -> 抓取req.params.id中指定的資料id，利用Todo.findById(id).then()，然後在回轉到`/`頁面
```js
// app.js  要先引入method-override套件去讓Method-override 與 query string 覆寫 HTTP 請求
const methodOverride = require('method-override')
app.use(methodOverride('_method')) 

// currency.js
const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

router.post('/new', (req, res) => {
  const name = req.body.name
  return Todo.create({ name: name[0], exchange: name[1], buyPrice: name[2], date: new Date() })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
module.exports = router
```
## 心得
目前可以讓所有使用者可以輸入自己的外幣當時購買匯率，去計算每一次總盈虧，但因為是公開的，所有使用者可以存取，會造成混亂，目前會在下一個版本新增使用者登入功能

