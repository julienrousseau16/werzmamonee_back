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


app.get('/expense', (req, res) => {
  connection.query('SELECT * FROM expense', (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error while getting expenses')
    }
    res.json(results)
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
      console.log(update)
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