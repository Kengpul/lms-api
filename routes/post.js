const express = require("express");
const router = express.Router();
const post = require("../controllers/post");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const catchAsync = require("../utils/catchAsync");
const { validateContent, validateId } = require("../middlewares");

router
  .route("/")
  .get(catchAsync(post.index))
  .post(validateContent, catchAsync(post.create));
  
router.post("/uploadimage", upload.any("content-photo"), catchAsync(post.uploadImage));

router
  .route("/:id")
  .get(validateId, catchAsync(post.getOne))
  .put(validateId, validateContent, catchAsync(post.edit))
  .delete(validateId, catchAsync(post.delete));

router.post("/:id/comment", validateId, validateContent, catchAsync(post.comment));

module.exports = router;
