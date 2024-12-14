const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const employeeRoutes = require("./routes/employeeRoutes");
const path = require('path');

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files for the landing page
app.use(express.static(path.join(__dirname, 'public')));

// Landing page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/employee', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
