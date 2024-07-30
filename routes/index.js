const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./config/firebaseServiceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://your-database-name.firebaseio.com'
});

const db = admin.firestore();

// Use routes
app.use('/restaurants', restaurantRoutes);
app.use('/orders', orderRoutes);

// Example route to test the server
app.get('/', (req, res) => {
    res.send('OrderHub Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});