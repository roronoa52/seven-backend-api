const mongoose = require('mongoose')
const { urlDb } = require('../config')

mongoose.connect(urlDb);
console.log(urlDb)
const db = mongoose.connection

module.exports = db