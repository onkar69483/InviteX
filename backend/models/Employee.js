const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  familyMembers: [
    {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      status: { type: String, enum: ["Pending", "Attended"], default: "Pending" },
    },
  ],
  eventAttended: { type: Boolean },
  otp: { type: String },
  otpExpiresAt: { type: Date },
});

module.exports = mongoose.model("Employee", employeeSchema);
