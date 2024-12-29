const express = require("express");
const router = express.Router();
const reviewController=require("../controllers/reviews")

router.post('/generateFakeReviews/:no_reviews', reviewController.generateFakeReviews)
router.post("/addReview/:albumId", reviewController.addReview);
router.get("/getReviewsByAlbumId/:albumId", reviewController.getReviewsByAlbumId);
router.put("/:reviewId", reviewController.updateReview);
router.delete("/:reviewId", reviewController.deleteReview);

module.exports=router