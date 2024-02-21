const express = require("express");
const userRouter = require('./user').default

const router = express.Routerouter();

router.use('/user', userRouter);

module.exports = router;