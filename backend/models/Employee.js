const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  familyMembers: [
    {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      status: { type: String, enum: ["Pending", "Attended"], default: "Pending" },
    },
  ],
  otp: { type: String },
  qrCode: { type: String },
  eventAttended: { type: Boolean },
});

module.exports = mongoose.model("Employee", employeeSchema);
