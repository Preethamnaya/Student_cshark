require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const path = require('path');

// Serve static assets in production (if frontend build exists)
app.use(express.static(path.join(__dirname, '../Frontend/my-project/build')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/modules', require('./routes/module'));
app.use('/api/certificates', require('./routes/certificate'));

// Catch-all route to serve React frontend SPA index.html for client-side routing
app.get('(.*)', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Frontend/my-project/build', 'index.html'));
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
