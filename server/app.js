const express = require('express');
const cors = require('cors'); 
const path = require('path');
require('dotenv').config();
const ConnectDB = require('./DataBase/db.until');

const app = express();
const port = process.env.PORT || 3300;

// Middleware
app.use(express.json());
app.use(cors());

//  Images ko serve karne ke liye static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/advertisment', require('./Router/Advertisment'));
app.use('/api/v1/category', require('./Router/Category'));
app.use('/api/v1/city', require('./Router/City'));
app.use('/api/v1/area', require('./Router/CityArea'));
app.use('/api/v1/country', require('./Router/Country'));
app.use('/api/v1/province', require('./Router/Province'));
app.use('/api/v1/role', require('./Router/Role'));
app.use('/api/v1/status', require('./Router/Status'));
app.use('/api/v1/auth', require('./Router/authRoutes'));
app.use('/api/v1/contact', require('./Router/Contact'));

app.get('/', (req, res) => { res.send('PakClassified Backend is Running!'); });

async function Startserver() {
   try {
    await ConnectDB();
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
   } catch (error) {
    console.log(`Database connection error:`, error.message);
    process.exit(1);
   } 
}
Startserver();