const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

const routes = require('./routes')
app.use(routes)

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

// const Todo = require('./models/todo')

// app.post('/currency/new', (req, res) => {
//   const name = req.body.name
//   return Todo.create({ name: name[0], exchange: name[1], buyPrice: name[2], date: new Date() })
//     .then(() => res.redirect('/'))
//     .catch(error => console.log(error))
// })

// app.delete('/currency/:id', (req, res) => {
//   const id = req.params.id
//   return Todo.findById(id)
//     .then(todo => todo.remove())
//     .then(() => res.redirect('/'))
//     .catch(error => console.log(error))
// })

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
