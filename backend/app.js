const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

//read configuration from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());

//Helmet helps secure Express apps by setting HTTP response headers.
app.use(helmet());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

//Port
const PORT = process.env.PORT || 5000;

//Listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
