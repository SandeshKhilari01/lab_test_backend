const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/confirmation', emailController.sendLabBookingConfirmation);
router.post('/confirmation', emailController.sendLabBookingConfirmation);

module.exports = router;