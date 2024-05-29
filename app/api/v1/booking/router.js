const express = require('express');
const router = express();
const { create, index, find, update, destroy, indexHistory } = require('./controller');
const {
  authenticateUser,
} = require('../../../middlewares/auth');

router.post('/bookings', create);
router.get('/bookings', authenticateUser, index);
router.get('/historybookings', authenticateUser, indexHistory);
router.get('/bookings/:id', authenticateUser, find);
router.put('/bookings/:id', authenticateUser, update);
// router.delete('/bookings/:id', authenticateUser, destroy);

module.exports = router;