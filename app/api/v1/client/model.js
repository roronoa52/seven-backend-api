const mongoose = require('mongoose')
const { model, Schema } = mongoose
const bcrypt = require('bcryptjs')

let clientSchema = Schema (
    {
        name: {
            type: String,
            required: [true, 'Nama harus diisi'],
            minlength: 3,
            maxlength: 50
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email harus diisi']
        },
        token: {
            type: String,
        },
    },
    { timestamps: true }
)

module.exports = model('Clients', clientSchema)