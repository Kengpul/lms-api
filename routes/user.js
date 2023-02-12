const express = require("express");
const router = express.Router();
const { validateRegister, validateLogin } = require("../middlewares/");
const catchAsync = require("../utils/catchAsync");

const user = require("../controllers/user");

router.post("/signup", validateRegister, catchAsync(user.signup));

router.post("/login", validateLogin, catchAsync(user.login));

module.exports = router;
