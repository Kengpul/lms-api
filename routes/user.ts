import express from "express";
const router = express.Router();
import { validateRegister, validateLogin } from "../middlewares/";
import catchAsync from "../utils/catchAsync";

import * as user from "../controllers/user";

router.post("/signup", validateRegister, catchAsync(user.signup));

router.post("/login", validateLogin, catchAsync(user.login));

export default router;
