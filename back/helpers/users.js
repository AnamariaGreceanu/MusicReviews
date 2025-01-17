const db = require("../config/config");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const secretToken = process.env.SECRET_TOKEN;

const findUserByEmail = async (email) => {
    try {
        const userSnapshot = await db.collection("users")
            .where("email", "==", email)
            .get();
        
        if (!userSnapshot.empty) {
            const doc = userSnapshot.docs[0];
            let user = doc.data();
            user.id = doc.id;
            return user;
        }
    } catch (error) {
        console.error("Error getting documents:  ", error);
    }
    return null;
};

const findUserNameById = async (id) => {
    try {
        const userDoc = await db.collection("users").doc(id).get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            return userData.username;
        } else {
            console.log("User not found");
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
    }
    return null;
};

const generateToken = (email) => {
    let token = jwt.sign({ email }, secretToken,{ expiresIn: "3h"})
    return token
}

module.exports = {findUserByEmail,generateToken,findUserNameById};