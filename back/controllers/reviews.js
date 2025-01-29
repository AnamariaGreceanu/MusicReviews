const { faker } = require('@faker-js/faker')
const db=require('../config/config')
const { findUserNameById } = require('../helpers/users')
const { v4: uuidv4 } = require('uuid');

const generateFakeReviews = async (req, res) => {
    try {
        const albums = []
        const users = []
        const albumsDatabase = await db.collection('albums').get()
        const usersDatabase = await db.collection('users').get()
        
        albumsDatabase.docs.map((album) => {
            albums.push(album.ref)
        })
        usersDatabase.docs.map((user) => {
            users.push(user.id)
        })

        const no_reviews = req.params.no_reviews;
        for (let i = 0; i < no_reviews; i++) {
            const userId = faker.helpers.arrayElement(users)
            const review = faker.lorem.sentences({ min: 1, max: 3 })
            const isLiked = faker.datatype.boolean()
            const albumRef = faker.helpers.arrayElement(albums);

            const albumDoc = await albumRef.get();
            const albumData = albumDoc.data();
            const reviews = albumData.reviews || [];
        
            const fakeReview = {
                'reviewId':uuidv4(),
                'userId': userId,
                'review': review,
                'isLiked': isLiked
            }

            reviews.push(fakeReview);
            await albumRef.update({ reviews });
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
        const albumRef = db.collection("albums").doc(albumId);
        const albumDoc = await albumRef.get();

        if (!albumDoc.exists) {
            return res.status(404).json({ message: "Album not found" });
        }

        let reviews = albumDoc.data().reviews || []; 
        let newReview = { ...req.body };
        newReview.reviewId = uuidv4();
        newReview.userId = req.user;
        reviews.push(newReview);

        await albumRef.update({ reviews });
        return res.status(201).json({ message: "Review created succesfully", newReview });
    } catch (err){
        return res.status(500).json(err);
    }
};

const getReviewsByAlbumId = async (req, res) => {
    try {
        const albumId = req.params.albumId;
         const albumRef = db.collection("albums").doc(albumId);
        const albumDoc = await albumRef.get();
        if (!albumDoc.exists) {
            return res.status(404).json({ message: "Album not found" });
        }

        if (!albumDoc.data().reviews) {
            return res.status(200).json([]);
        }

        let reviews = [];
        for (const doc of albumDoc.data().reviews) {
            const review = doc;
            const username = await findUserNameById(doc.userId)
            reviews.push({...review,username: username})
        }
        return res.status(200).json(reviews);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const updateReview = async (req, res) => {
    try {
        let { review, isLiked } = req.body
        if (!review || isLiked === null) {
            return res.status(400).send("Review content and you choosing if you liked is mandatory")
        }
        const { albumId, reviewId } = req.params; 
        const albumRef = db.collection("albums").doc(albumId);
        const albumDoc = await albumRef.get();

        if (!albumDoc.exists) {
            return res.status(404).json({ message: "Album not found" });
        }

        let reviews = albumDoc.data().reviews || [];
        const reviewIndex = reviews.findIndex((r) => r.reviewId === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Review not found" });
        }

        reviews[reviewIndex] = {
            ...reviews[reviewIndex],
            review,
            isLiked
        };

        await albumRef.update({ reviews });
        return res.status(200).json({ message: "Review was uppdated", newReview:reviews[reviewIndex] });
    } catch (err){
        return res.status(500).send(err);
    }
};

const deleteReview = async (req, res) => {
    try {
        const { albumId, reviewId } = req.params;
        const albumRef = db.collection("albums").doc(albumId);
        const albumDoc = await albumRef.get();

        if (!albumDoc.exists) {
            return res.status(404).json({ message: "Album not found" });
        }

        let reviews =  albumDoc.data().reviews || [];
        const reviewIndex = reviews.findIndex(review => review.reviewId === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Review not found" });
        }

        reviews.splice(reviewIndex, 1);
        await albumRef.update({ reviews });
        return res.status(200).json({message:"Review deleted"});
    } catch (err){
        return res.status(500).send(err);
    }
};

module.exports={generateFakeReviews, getReviewsByAlbumId, addReview, deleteReview, updateReview}