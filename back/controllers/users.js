const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt')
const db = require('../config/config');
const { findUserByEmail, generateToken } = require('../helpers/users');

const generateFakeUsers = async (req, res) => {
    try { 
        const no_users = req.params.no_users;

        for (let i = 0; i < no_users; i++){
            const username = faker.internet.displayName()
            const email = faker.internet.exampleEmail()
            const password = faker.internet.password()
            const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            const fakePerson = {
                'username': username,
                'email': email,
                'password': hashedPassword
            }
            await db.collection('users').add(fakePerson)
        }
        return res.status(201).json({message:'New users added'})
    } catch (err) {
        return res.status(500).json({ message: 'Server error: ' + err })
    }
}

const registerUser = async (req, res) => {
    try {
        let { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).send({message: "Username, email and password are mandatory"})
        }
        
        let user = await findUserByEmail(email)
        if (user) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        let salt = await bcrypt.genSalt(10)
        let encryptedPassw = await bcrypt.hash(password, salt)

        try {
            user = {
                'username': username,
                "email": email,
                "password": encryptedPassw
            };
            await db.collection("users").add({ ...req.body, password: encryptedPassw });
            return res.status(201).json({ message: "Account created succesfully!", user });
        } catch (err) {
            return res.status(400).send(err)
        }
    } catch (err) {
        return res.status(500).send(err)
    }
}

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body
        if ( !email || !password) {
            return res.status(400).send("email and password are mandatory")
        }
        
        let user = await findUserByEmail(email)
        if (!user) {
            return res.status(404).json({ message: "User does not exist with this email" });
        }

        let passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(403).send({message:"Invalid password for this email"})
        }
        let accessToken = generateToken(user.email)
        return res.status(200).send({ message: "Logged in!", user, accessToken });
    } catch (err) {
        return res.status(500).send(err)
    }
}

module.exports={generateFakeUsers,registerUser,loginUser}