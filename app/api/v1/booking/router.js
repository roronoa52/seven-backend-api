const express = require('express');
const router = express();
const { create, index, find, update, indexHistory, activeNotification, indexClient } = require('./controller');
const {
  authenticateUser,
  authenticateClient
} = require('../../../middlewares/auth');

router.post('/bookings', authenticateClient, create);
router.get('/bookings', authenticateUser, index);
router.get('/client/bookings', authenticateClient, indexClient);
router.get('/historybookings', authenticateUser, indexHistory);
router.get('/bookings/:id', authenticateUser, find);
router.get('/google-calendar/:idbooking', authenticateClient, activeNotification);
router.put('/bookings/:id', authenticateUser, update);
// router.delete('/bookings/:id', authenticateUser, destroy);

module.exports = router;