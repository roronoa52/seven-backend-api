const mongoose = require('mongoose')
const { model, Schema } = mongoose

const bankSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama bank harus diisi']
        },
        rek: {
            type: String,
            required: [true, 'Rekening bank harus diisi']
        },
        image: {
            type: mongoose.Types.ObjectId,
            ref: 'Image',
            required: true
        },
    },
    { timestamps: true }
)

module.exports = model ('Bank', bankSchema)