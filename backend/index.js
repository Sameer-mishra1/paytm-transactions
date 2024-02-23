const express = require("express");
const cors = require("cors");
const mainRouter = require('./routes/index')
const dotenv = require('dotenv')
dotenv.config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', mainRouter)

app.listen(3000);
console.log('listening on 3000')