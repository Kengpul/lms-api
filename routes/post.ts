import express from "express";
const router = express.Router();
import multer from "multer";
import { storage } from "../cloudinary";
const upload = multer({ storage });
import catchAsync from "../utils/catchAsync";

import * as post from "../controllers/post";
import {
  validateContent,
  validateId,
  requireAuth,
  isAuthor,
} from "../middlewares";

router.use(catchAsync(requireAuth));

router
  .route("/")
  .get(catchAsync(post.index))
  .post(validateContent, catchAsync(post.create));

router.post("/uploadimage", upload.any(), catchAsync(post.uploadImage));

router
  .route("/:id")
  .get(validateId, catchAsync(isAuthor), catchAsync(post.getOne))
  .put(validateId, catchAsync(isAuthor), validateContent, catchAsync(post.edit))
  .delete(validateId, catchAsync(isAuthor), catchAsync(post.destroy));

router.post(
  "/:id/comment",
  validateId,
  validateContent,
  catchAsync(post.comment)
);
router.post("/:id/like", validateId, catchAsync(post.like));

export default router;
