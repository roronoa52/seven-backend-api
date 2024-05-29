const mongoose = require('mongoose')
const { model, Schema } = mongoose

const productSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Nama produk harus diisi']
        },
        price: {
            type: Number,
            required: [true, 'Harga harus diisi']
        },
        image: {
            type: mongoose.Types.ObjectId,
            ref: 'Image',
            required: true
        }
    },
    { timestamps: true }
)

module.exports = model ('Product', productSchema)