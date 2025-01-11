const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require("cors");
const router = require('./routes/index');
const authenticateToken=require("./middlewares/auth")

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api", authenticateToken, router)
// app.use('/api', router);

app.listen(process.env.PORT || 8000, ()=> {
    console.log("Server started listening on port " + process.env.PORT);
})