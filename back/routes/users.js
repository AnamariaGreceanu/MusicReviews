const express = require("express");
const router = express.Router();
const userController=require("../controllers/users")

router.post('/generateFakeUsers/:no_users', userController.generateFakeUsers)
router.post('/login', userController.loginUser)
router.post('/register', userController.registerUser)

router.post("/addAlbumToFavourites/:albumId", userController.addAlbumToFavourites);
router.get("/getFavouriteAlbums", userController.getFavouriteAlbums);
router.delete("/removeFromFavourites/:favouriteId", userController.removeFromFavourites);

module.exports=router