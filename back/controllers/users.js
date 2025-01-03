const { faker } = require('@faker-js/faker')
const bcrypt = require('bcrypt')
const db=require('../config/config')

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

module.exports={generateFakeUsers}