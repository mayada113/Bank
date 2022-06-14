const express = require('express')
const app = express()
const api = require('./server/routes/api')
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

    next()
})


const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/TransactionsDB', { useNewUrlParser: true })

app.use('/', api)

app.listen(port, function(){
    console.log(`Running server on port ${port}`)
})