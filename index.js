const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();
const PORT = 3000;

const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(bodyParser.json());

app.post('/send-notification', async (req, res) => {
  try {
    const { to, notification, data } = req.body;

    if (!to || !notification?.title || !notification?.body) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = {
      token: to,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: data || {},
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent:', response);
    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('🔥 Error sending FCM notification:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
