const Booking = require('../../api/v1/booking/model');
const History = require('../../api/v1/history/model');
const Product = require('../../api/v1/product/model');
const { checkingImage } = require('./images');

const { NotFoundError, BadRequestError } = require('../../errors');

const createBooking = async (req) => {
  const { firstName, middleName, lastName, email, productid, status, image, startDate, duration, isNeedNotification } = req.body;

  await checkingImage(image);

  const product = await Product.findById(productid);
  if (!product) {
    throw new Error('Product tidak ditemukan');
  }

  const totalBooking = product.price * duration

  const startDateTime = new Date(startDate);

  const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);

  const conflictingBooking = await Booking.findOne({
    product: product._id,
    $or: [
      { startDate: { $lt: endDateTime }, endDate: { $gt: startDateTime } },
      { startDate: { $lt: endDateTime }, endDate: { $gt: endDateTime } },
      { startDate: { $gte: startDateTime }, endDate: { $lt: endDateTime } }
    ]
  });

  if (conflictingBooking) {
    throw new Error('Jadwal booking bentrok dengan booking lain');
  }

  const result = await Booking.create({
    firstName,
    middleName,
    lastName,
    email,
    total: totalBooking,
    status,
    image,
    product: product._id,
    startDate: startDateTime,
    endDate: endDateTime,
    duration,
    isNeedNotification
  });

  return result;
};

const getAllBooking = async (req) => {
  const { keyword } = req.query
  
  let condition = {};

  if(keyword){
    condition = { ...condition, status: { $regex: keyword, $options: 'i'}}
}

  const result = await Booking.find(condition)
    .populate({
      path: 'image',
      select: '_id name dataImage typeImage',
    })
    .populate({
      path: 'product',
      select: '_id name', 
    })
    .select('_id firstName middleName lastName email total status image product startDate endDate duration isNeedNotification');

  return result;
}

const getAllBookingHistory = async (req) => {
  const { keyword } = req.query
  
  let condition = {};

  if(keyword){
    condition = { ...condition, status: { $regex: keyword, $options: 'i'}}
}

  const result = await History.find(condition)
    .populate({
      path: 'image',
      select: '_id name dataImage typeImage',
    })
    .populate({
      path: 'product',
      select: '_id name',
    })
    .populate({
      path: 'admin',
      select: '_id name',
    })
    .select('_id firstName middleName lastName email total status image product startDate endDate duration isNeedNotification');

  return result;
}

const getOneBooking = async (req) => {
  const { id } = req.params;

  const result = await Booking.findOne({
    _id: id,
  })
    .populate({
      path: 'image',
      select: '_id name dataImage typeImage',
    })
    .populate({
      path: 'product',
      select: '_id name',
    })
    .select('_id firstName middleName lastName email total status image product startDate endDate duration isNeedNotification');

  if (!result)
    throw new NotFoundError(`Tidak ada tipe booking dengan id :  ${id}`);

  return result;
};

const updateBooking = async (req) => {
  const { id } = req.params;
  const { status } = req.body;

  // Perbarui tipe booking
  const result = await Booking.findOneAndUpdate(
    { _id: id },
    { status },
    { new: true, runValidators: true }
  );

  // Buat riwayat perubahan
  await History.create({
    firstName: result.firstName,
    middleName: result.middleName,
    lastName: result.lastName,
    email: result.email,
    total: result.total,
    status: status, // Menggunakan status dari request, bukan dari result
    image: result.image,
    product: result.product,
    admin: req.user.id,
    startDate: result.startDate,
    endDate: result.endDate,
    duration: result.duration,
    isNeedNotification: result.isNeedNotification
  });

  if (!result)
    throw new NotFoundError(`Tidak ada tipe booking dengan id :  ${id}`);

  return result;
};

const deleteBooking = async (req) => {
  const { id } = req.params;

  const result = await Booking.findOneAndDelete({
    _id: id
})

  if (!result)
    throw new NotFoundError(`Tidak ada tipe booking dengan id :  ${id}`);

  return result;
};

const checkingBooking = async (id) => {
  const result = await Booking.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada tipe booking dengan id :  ${id}`);

  return result;
};

module.exports = {
  createBooking,
  getAllBooking,
  getOneBooking,
  updateBooking,
  deleteBooking,
  checkingBooking,
  getAllBookingHistory
};