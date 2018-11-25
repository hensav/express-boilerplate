const express = require('express')
const app = express()
const cors = require('cors')

const { json: jsonParser, urlencoded: urlencodedParser } = require('body-parser')

const path = require('path')

app.use(cors({origin: '*'}))
app.use(express.static(path.join(__dirname, 'public')))

app.set('json spaces', 2)

const errorHandler = (err, req, res, next) => res.status(err.status || 500).json({
  success: false,
  error: err.message,
  stack: err.stack
})

const notFoundHandler = (req, res, next) => res.status(404).json({ success: false, error: 'invalid route' })

app.use(jsonParser(), urlencodedParser({ extended: false }))

app.use('/api', require('./routes'), notFoundHandler, errorHandler)

module.exports = app
