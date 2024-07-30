const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Create a new order
router.post('/', async (req, res) => {
    const newOrder = req.body;
    try {
        const docRef = await db.collection('orders').add(newOrder);
        res.status(201).send({ id: docRef.id });
        sendOrderNotification(newOrder.userId, 'Your order has been placed!');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get all orders for a user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const snapshot = await db.collection('orders').where('userId', '==', userId).get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(orders);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Function to send push notifications
async function sendOrderNotification(userId, message) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        const token = userDoc.data().fcmToken;
        const payload = {
            notification: {
                title: 'OrderHub',
                body: message
            }
        };
        await admin.messaging().sendToDevice(token, payload);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

module.exports = router;