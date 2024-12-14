const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;  
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; 

const client = twilio(accountSid, authToken);

// Send SMS
const sendOtp = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code for InviteX is: ${otp}`, // SMS content
      from: twilioPhoneNumber,          
      to: phoneNumber,                 
    });

    console.log('OTP sent:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

module.exports = { sendOtp };
