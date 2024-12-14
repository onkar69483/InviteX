const { sendOtp } = require('../services/twilioService');
const { generateOtp, verifyOtp } = require('../services/otpService');
const Employee = require('../models/Employee');

// Helper function to ensure the phone number includes +91
const formatPhoneNumber = (phoneNumber) => {
  // Check if the phone number starts with +91; if not, add it
  return phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
};

// Send OTP
const sendOtpHandler = async (req, res) => {
  const { employeeNumber, phoneNumber } = req.body;

  try {
    // Validate phone number (ensure employee exists)
    const employee = await Employee.findOne({ employeeId: employeeNumber });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Format the phone number to include +91
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

    // Generate OTP and expiry
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-minute expiry

    // Save OTP and expiry to the employee's record
    employee.otp = otp;
    employee.otpExpiresAt = otpExpiresAt;
    await employee.save();

    // Send OTP via Twilio
    await sendOtp(formattedPhoneNumber, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
};

// Verify OTP
const verifyOtpHandler = async (req, res) => {
    const { employeeNumber, phoneNumber, otp } = req.body;
  
    try {
      // Check if the employee exists
      const employee = await Employee.findOne({ employeeId: employeeNumber });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // Validate OTP
      const isValid = verifyOtp(employee.otp, otp, employee.otpExpiresAt);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // OTP is valid; proceed with login
      employee.otp = null; // Clear OTP after successful verification
      employee.otpExpiresAt = null;
      await employee.save();
  
      // Send employee information in the response
      res.status(200).json({
        message: 'OTP verified successfully',
        employee: {
          employeeId: employee.employeeId,
          name: employee.name,
          phoneNumber: employee.phoneNumber,
          email: employee.email, 
          familyMembers: employee.familyMembers
        },
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: 'Failed to verify OTP', error });
    }
  };

module.exports = { sendOtpHandler, verifyOtpHandler };
