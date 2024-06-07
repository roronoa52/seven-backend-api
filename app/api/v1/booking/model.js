const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: [true, 'Nama depan harus diisi'],
        minlength: 3,
        maxlength: 50
      },
      middleName: {
        type: String,
        required: false,
      },
      lastName: {
        type: String,
        required: [true, 'Nama belakang harus diisi'],
        minlength: 3,
        maxlength: 50
      },
      email: {
        type: String,
        required: [true, 'Email harus diisi'] 
      },
      total: {
        type: Number,
        required: [true, 'Total harus diisi']
      },
      status: {
        type: String,
        enum: ["pending", "ditolak", "berhasil"],
        default: true,
      },
      image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
        required: true,
      },
      product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      clientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Clients',
        required: true
      },
      startDate: {
        type: Date,
        required: [true, 'Start date harus diisi']
      },
      endDate: {
        type: Date,
        required: [true, 'End date harus diisi']
      },
      duration: {
        type: Number,
        required: [true, 'Duration harus diisi'],
        min: [1, 'Duration minimal 1 jam']
      },
      isNeedNotification: {
        type: Boolean,
        default: false
      }
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Booking', BookingSchema);