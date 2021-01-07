require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
// const { check, validationResult } = require('express-validator')
const connection = require('./db-config')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())


app.get('/expenses', (req, res) => {
  const id = req.query.id
  let sql = 'SELECT * FROM expense'
  const sqlValues = []
  if (id) {
    sql += ' WHERE id = ?';
    sqlValues.push(id);
  }
  connection.query(sql, sqlValues, (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error while getting expenses')
    }
    res.json(results)
  })
})

app.post('/expenses', (req, res) => {
  const formData = req.body
  connection.query('INSERT INTO expense SET ?', formData, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error while adding a new expense')
    }
    connection.query('SELECT * FROM expense WHERE id = ?', result.insertId, (err, update) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error sending the update')
      }
      res.status(201).json(update)
    })

  })
})

app.put('/expenses/:id', (req, res) => {
  const formData = req.body
  const id = parseInt(req.params.id)
  connection.query('UPDATE expense SET ? WHERE id = ?', [formData, id], (err, result) => {
    if (err) {
      res.status(500).send('Error while changing user data')
    }
    connection.query('SELECT * FROM expense WHERE id = ?', id, (err, update) => {
      if (err) {
        console.log(err)
        res.status(200).send('Error while getting expense update')
      }
      res.status(200).json(update)
    })
  })
})

app.get('/admin', (req, res) => {
  connection.query('SELECT * FROM user WHERE id = 1', (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error while getting admin data')
    }
    res.json(results[0])
  })
})

app.put('/admin', (req, res) => {
  const formData = req.body
  connection.query('UPDATE user SET ? WHERE id = 1', formData, (err, results) => {
    if (err) {
      res.status(500).send('Error while changing user data')
    }
    connection.query('SELECT * FROM user WHERE id = 1', (err, update) => {
      if (err) {
        throw new Error('Oopsy')
      }
      res.json(update)
    })
  })
})

app.listen(process.env.PORT, (err) => {
  if (err) {
    throw new Error('Something bad happened...')
  }

  console.log(`Server is listening on ${process.env.PORT}`)
})