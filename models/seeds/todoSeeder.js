const db = require('../../config/mongoose')
const Stoke = require('../todo') // 載入 todo model

db.once('open', () => {
  console.log('mongodb connected!')
  Stoke.create({
    name: '人民幣 (CNY)',
    exchange: 4.309,
    buyPrice: 85000,
    date: '09/04'
  })
  Stoke.create({
    name: '美金 (USD)',
    exchange: 29.359,
    buyPrice: 100000,
    date: '09/02'
  })
  console.log('done')
})
