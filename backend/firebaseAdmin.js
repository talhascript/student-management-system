// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./stmgmt-a3d00-firebase-adminsdk-4fiqp-0610342a7c.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
