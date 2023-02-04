const express = require('express');
const router = express.Router();
const post = require('../controllers/post');

router.route('/')
    .get(post.index)
    .post(post.create)

router.route('/:id')
    .get(post.getOne)
    .put(post.edit)
    .delete(post.delete)

router.post('/:id/comment', post.comment)

module.exports = router;