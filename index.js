const express = require("express")
const imagesRouter = require("./app/api/v1/images/router")
const banksRouter = require("./app/api/v1/banks/router")
const productsRouter = require("./app/api/v1/product/router")
const autoCMSRouter = require("./app/api/v1/auth/router")
const bookingRouter = require("./app/api/v1/booking/router")
const db = require('./app/db/index')
const { PORT } = require("./app/config")
const { urlDb } = require("./app/config")
const notFoundMiddleware = require('./app/middlewares/not-found')
const handleErrorMiddleware = require('./app/middlewares/handler-error')
const mongoose = require('mongoose');
const cors = require('cors')

const app = express()
const port = PORT || 3000

db.on('error', (err) => {
    console.log('Connection Error: Tidak terhubung ke mongo DB')
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {

    res.status(200).json({
        message: "Selamat datang di 7Seven"
    })
})

app.use('/api/v1/cms', imagesRouter)
app.use('/api/v1/cms', banksRouter)
app.use('/api/v1/cms', productsRouter)
app.use('/api/v1/cms', autoCMSRouter)
app.use('/api/v1/cms', bookingRouter)
app.use(notFoundMiddleware)
app.use(handleErrorMiddleware)

db.on('open', () => {
    console.log("Database Terhubung")

    app.listen( port, () => {
        console.log(`listening on port ${port}`)
      })
})