var admin = require("firebase-admin");

var serviceAccount = require("./musicreviews-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db;