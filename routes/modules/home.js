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

module.exports = router
