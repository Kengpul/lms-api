const express = require('express');
const router = express.Router();
const post = require('../controllers/post');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage})

router.route('/')
    .get(post.index)
    .post(post.create)

router.route('/:id')
    .get(post.getOne)
    .put(post.edit)
    .delete(post.delete)

router.post('/:id/comment', post.comment)

router.post('/uploadimage', upload.any("content-photo"), post.uploadImage)

module.exports = router;