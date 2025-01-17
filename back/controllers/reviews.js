const { faker } = require('@faker-js/faker')
const db=require('../config/config')
const { findUserNameById } = require('../helpers/users')

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

const addReview = async(req, res) => {
    try {
        let { review, isLiked } = req.body
        if (!review || isLiked === null) {
            return res.status(400).send("Review content and you choosing if you liked is mandatory")
        }
        const albumId = req.params.albumId;
        let newReview = { ...req.body };
        newReview.userId = req.user;
        newReview.albumId = albumId;
        await db.collection("reviews").add(newReview);
        return res.status(201).json({ message: "Review created succesfully", newReview });
    } catch (err){
        return res.status(500).json(err);
    }
};

const getReviewsByAlbumId = async (req, res) => {
    try {
        const albumId = req.params.albumId;
        const reviewsSnapshot = await db.collection("reviews").where("albumId", "==", albumId).get();

        if (reviewsSnapshot.empty) {
            return res.status(200).json([]);
        }

        let reviews = [];
        for (const doc of reviewsSnapshot.docs) {
            const review = doc.data();
            review.id = doc.id;
            const username = await findUserNameById(review.userId);
            reviews.push({...review,username: username});
        }
        return res.status(200).json(reviews);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const updateReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        let review = {...req.body};
        await db.collection("reviews").doc(reviewId).update(review);
        return res.status(200).json({ message: "review was uppdated", review });
    } catch (err){
        return res.status(500).send(err);
    }
};

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        await db.collection("reviews").doc(reviewId).delete();
        return res.status(200).json({message:"Review deleted"});
    } catch (err){
        return res.status(500).send(err);
    }
};

module.exports={generateFakeReviews, getReviewsByAlbumId, addReview, deleteReview, updateReview}