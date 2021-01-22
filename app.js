const express = require('express')
const app = express()
const catchCurrency = require('./public/js/catchPrice')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/stoke', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

const Todo = require('./models/todo')
app.get('/', (req, res) => {
  async function doThings() {
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
  } doThings()
})

app.post('/currency/new', (req, res) => {
  const name = req.body.name
  return Todo.create({ name: name[0], exchange: name[1], buyPrice: name[2], date: new Date() })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/currency/:id/delete', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
