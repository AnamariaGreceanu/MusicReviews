const express = require("express");
const router = express.Router();
const albumController=require("../controllers/albums")

router.post('/generateFakeAlbums/:no_albums', albumController.generateFakeAlbums)
router.get('/getAllAlbums', albumController.getAllAlbums)

module.exports=router