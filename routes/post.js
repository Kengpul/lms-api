const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const catchAsync = require("../utils/catchAsync");

const post = require("../controllers/post");
const { validateContent, validateId, requireAuth, isAuthor } = require("../middlewares");

router.use(catchAsync(requireAuth))

router
  .route("/")
  .get(catchAsync(post.index))
  .post(validateContent, catchAsync(post.create));
  
router.post("/uploadimage", upload.any("content-photo"), catchAsync(post.uploadImage));

router
  .route("/:id")
  .get(validateId, catchAsync(isAuthor), catchAsync(post.getOne))
  .put(validateId, catchAsync(isAuthor), validateContent, catchAsync(post.edit))
  .delete(validateId, catchAsync(isAuthor), catchAsync(post.delete));

router.post("/:id/comment", validateId, validateContent, catchAsync(post.comment));
router.post("/:id/like", validateId, catchAsync(post.like));

module.exports = router;
