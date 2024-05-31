const { StatusCodes } = require('http-status-codes');

const {
  createBooking,
  getAllBooking,
  getOneBooking,
  updateBooking,
  deleteBooking,
  getAllBookingHistory
  } = require('../../../services/mongoosee/booking');
const { bufferToBase64 } = require('../../../utils/base64');
const { transport, mailOptions, sendToEmail } = require('../../../services/mail/mail');

  const create = async (req, res, next) => {
    try {
      const result = await createBooking(req);  
      
      await sendToEmail(req, result)

      setTimeout(() => {
      
      }, 5000);
  
      res.status(StatusCodes.CREATED).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  const index = async (req, res, next) => {
    try {
      const result = await getAllBooking(req);

      const resultCopy = JSON.parse(JSON.stringify(result));

      for (const data of resultCopy) {
        if (data && data.image.dataImage) {
          data.image.dataImage = bufferToBase64(data.image.dataImage);
        }
      }
  
      res.status(StatusCodes.OK).json({
        data: resultCopy,
      });
    } catch (err) {
      next(err);
    }
  };

  const indexHistory = async (req, res, next) => {
    try {
      const result = await getAllBookingHistory(req);

      const resultCopy = JSON.parse(JSON.stringify(result));

      for (const data of resultCopy) {
        if (data && data.image.dataImage) {
          data.image.dataImage = bufferToBase64(data.image.dataImage);
        }
      }
  
      res.status(StatusCodes.OK).json({
        data: resultCopy,
      });
    } catch (err) {
      next(err);
    }
  };

  const find = async (req, res, next) => {
    try {
      const result = await getOneBooking(req);

      const resultCopy = JSON.parse(JSON.stringify(result)); 
        
      resultCopy.image.dataImage = bufferToBase64(result.image.dataImage);
  
      res.status(StatusCodes.OK).json({
        data: resultCopy,
      });
    } catch (err) {
      next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      const result = await updateBooking(req);
  
      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  const destroy = async (req, res, next) => {
    try {
      const result = await deleteBooking(req);
      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  module.exports = {
    index,
    indexHistory,
    find,
    update,
    destroy,
    create,
  };