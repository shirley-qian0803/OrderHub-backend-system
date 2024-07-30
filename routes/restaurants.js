const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { getDistanceFromLatLonInKm } = require('../utils/geolocation');

// Create a new restaurant
router.post('/', async (req, res) => {
    const newRestaurant = req.body;
    try {
        const docRef = await db.collection('restaurants').add(newRestaurant);
        res.status(201).send({ id: docRef.id });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('restaurants').get();
        const restaurants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(restaurants);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get nearby restaurants
router.get('/nearby', async (req, res) => {
    const { lat, lng } = req.query;
    try {
        const snapshot = await db.collection('restaurants').get();
        const restaurants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const nearbyRestaurants = restaurants.filter(restaurant => {
            const distance = getDistanceFromLatLonInKm(lat, lng, restaurant.lat, restaurant.lng);
            return distance <= 5; // e.g., within 5 km
        });

        res.status(200).send(nearbyRestaurants);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;