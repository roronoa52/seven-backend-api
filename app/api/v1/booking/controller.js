const { StatusCodes } = require('http-status-codes');

const {
  createBooking,
  getAllBooking,
  getOneBooking,
  updateBooking,
  deleteBooking,
  getAllBookingHistory,
  getAllBookingClient
  } = require('../../../services/mongoosee/booking');
const { bufferToBase64 } = require('../../../utils/base64');
const { sendToEmailIfSuccess, sendToEmailIfError, createEvent } = require('../../../services/mail/mail');
const { oAuth2Client } = require('../../../google/oauth2');

  const create = async (req, res, next) => {
    try {
      const result = await createBooking(req);

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

  const indexClient = async (req, res, next) => {
    try {
      const result = await getAllBookingClient(req);

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

      if(req.body.status === "ditolak"){
        await sendToEmailIfError(result)
      }

      if(req.body.status === "berhasil"){
        await sendToEmailIfSuccess(result)
      }

  
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

  const activeNotification = async (req, res, next) => {
    try {
      const result = await getOneBooking(req);
  
      if (result.isNeedNotification && result.status == "berhasil") {
        await createEvent(oAuth2Client, result);
      }
  
      res.status(StatusCodes.OK).json({
        msg: "OK",
      });
    } catch (err) {
      console.error('Error in activeNotification:', err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Error processing request",
        error: err.message,
      });
    }
  };

  module.exports = {
    index,
    indexHistory,
    find,
    update,
    destroy,
    create,
    activeNotification,
    indexClient
  };