const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

const routes = require('./routes')
app.use(routes)

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))

require('./config/mongoose')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
