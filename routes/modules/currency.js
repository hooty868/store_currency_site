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
