const otpGenerator = require('otp-generator');

// Generate numeric OTP
exports.generateOtp = () => {
  return otpGenerator.generate(6, {
    digits: true,        // Include only digits
    upperCase: false,    // Exclude uppercase letters
    lowerCase: false,    // Exclude lowercase letters
    specialChars: false, // Exclude special characters
  });
};

// Verify OTP
exports.verifyOtp = (storedOtp, enteredOtp, expiry) => {
  if (storedOtp !== enteredOtp) return false;
  if (new Date() > expiry) return false;
  return true;
};
