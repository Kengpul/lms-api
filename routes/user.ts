import express from "express";
const router = express.Router();
import multer from "multer";
import { storage } from "../cloudinary/avatar";
const upload = multer({ storage });
import {
  validateRegister,
  validateLogin,
  validateId,
  requireAuth,
  isAuthor,
} from "../middlewares/";
import catchAsync from "../utils/catchAsync";
import * as user from "../controllers/user";

router.post("/signup", validateRegister, catchAsync(user.signup));

router.post("/login", validateLogin, catchAsync(user.login));

router.use(catchAsync(requireAuth));

router.post("/uploadImage", upload.any(), catchAsync(user.uploadAvatar));

router.put(
  "/:id/update",
  validateId,
  catchAsync(isAuthor),
  catchAsync(user.edit)
);

router.get("/:id", validateId, catchAsync(user.getUser));
router.get("/:id/posts", validateId, catchAsync(user.getUserPost));

export default router;
