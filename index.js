
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
// const { check, validationResult } = require('express-validator')
const connection = require('./db-config')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.listen(process.env.PORT, (err) => {
  if (err) {
    throw new Error('Something bad happened...')
  }

  console.log(`Server is listening on ${process.env.PORT}`)
})