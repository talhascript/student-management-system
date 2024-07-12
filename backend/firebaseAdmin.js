// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require(''); // here you add the required key file for the firestore connection

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
