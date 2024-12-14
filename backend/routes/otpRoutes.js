const express = require('express');
const { sendOtpHandler, verifyOtpHandler } = require('../controllers/otpController');

const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendOtpHandler);

// Route to verify OTP
router.post('/verify-otp', verifyOtpHandler);

module.exports = router;
