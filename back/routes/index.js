const express = require("express");
const router = express.Router();

const userRouter = require('./users')
const albumRouter = require('./albums')
const reviewRouter = require('./reviews')

router.use('/users', userRouter)
router.use('/albums', albumRouter)
router.use('/reviews', reviewRouter)

module.exports=router