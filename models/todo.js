const mongoose = require('mongoose')
const Schema = mongoose.Schema
const stokeSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  exchange: {
    type: Number, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  buyPrice: {
    type: Number, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  date: {
    type: Date // 資料型別是字串
  }
})
module.exports = mongoose.model('stoke', stokeSchema)
