const { faker } = require('@faker-js/faker')
const db=require('../config/config')

const generateFakeReviews = async (req, res) => {
    try { 
        const albums = []
        const users = []
        const albumsDatabase = await db.collection('albums').get()
        const usersDatabase = await db.collection('users').get()

        albumsDatabase.docs.map((album) => {
            albums.push(album.id)
        })
        usersDatabase.docs.map((user) => {
            users.push(user.id)
        })

        const no_reviews = req.params.no_reviews;
        
        for (let i = 0; i < no_reviews; i++){
            const albumId = faker.helpers.arrayElement(albums)
            const userId = faker.helpers.arrayElement(users)
            const review = faker.lorem.sentences({ min: 1, max: 3 }) 
            const isLiked = faker.datatype.boolean()
            
            const fakeReview = {
                'albumId': albumId,
                'userId': userId,
                'review': review,
                'isLiked': isLiked
            }
            await db.collection('reviews').add(fakeReview)
        }
        return res.status(201).json({message:'New reviews added'})
    } catch (err) {
        return res.status(500).json({ message: 'Server error: ' + err })
    }
}

module.exports={generateFakeReviews}