const mongoose = require("mongoose");
const { number } = require("zod");
const dotenv = require('dotenv')
dotenv.config();

// const username = process.env.MONGODB_USERNAME;
// const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.spftqfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {console.log("Connected to DB")})
    .catch((err) => {console.error('Error connecting to DB: ' + err);})

// Schemas
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
    }
});

// Accounts schema
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    balance: {
        type: Number,
        required: true
    }
})

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    Account
}