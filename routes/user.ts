import express from "express";
const router = express.Router();
import {
  validateRegister,
  validateLogin,
  validateId,
  requireAuth,
} from "../middlewares/";
import catchAsync from "../utils/catchAsync";
import * as user from "../controllers/user";

router.post("/signup", validateRegister, catchAsync(user.signup));

router.post("/login", validateLogin, catchAsync(user.login));

router.get("/:id", validateId, catchAsync(user.getUser));
router.get("/:id/posts", validateId, catchAsync(user.getUserPost));

export default router;
