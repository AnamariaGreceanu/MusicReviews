const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const { findUserByEmail } = require("../helpers/users");
dotenv.config();
const secretToken = process.env.SECRET_TOKEN;

const SAFE_ROUTES = ['/users/login', '/users/register']

const authenticateToken = async (req, res, next) => {
    if (SAFE_ROUTES.includes(req.path)) {
        return next()
    }
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).send("Authorization failed. No access token.");
    }
    const token = authHeader.split(" ")[1]
    try {
        const { email } = jwt.verify(token, secretToken);
        const user = await findUserByEmail(email)
        if (!user) {
            return res.status(404).send("User not found");
        }
        req.user = user.id; 
        return next();
    } catch (err) {
        console.error(err);
        return res.status(403).send("Could not verify token");
    }
 }

module.exports=authenticateToken