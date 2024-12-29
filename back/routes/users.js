const express = require("express");
const router = express.Router();
const userController=require("../controllers/users")

router.post('/generateFakeUsers/:no_users', userController.generateFakeUsers)
router.post('/login', userController.login)
router.post('/register', userController.register)

router.post("/addAlbumToFavourites/:albumId", userController.addAlbumToFavourites);
router.get("/getFavouriteAlbums", userController.getFavouriteAlbums);
router.delete("/removeFromFavourites/:albumId", userController.removeFromFavourites);

module.exports=router