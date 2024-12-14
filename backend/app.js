const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Default route
app.get('/', (req, res) => {
  res.send('InviteX Backend is running!');
});

app.use('/api/employee', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
