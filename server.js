
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 5000;

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Kullanıcı kayıt
app.post('/register', async (req, res) => {
  try {
    const { role, email, name } = req.body;
    await db.collection('users').add({ role, email, name });
    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kullanıcı giriş
app.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }
    let userData = {};
    snapshot.forEach(doc => userData = { id: doc.id, ...doc.data() });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
