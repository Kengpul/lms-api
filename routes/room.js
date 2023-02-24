const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { requireAuth } = require("../middlewares/");
const room = require("../controllers/room");

router.use(catchAsync(requireAuth));

router.route("/")
    .get(catchAsync(room.getAll))
    .post(catchAsync(room.create));

router.post("/join", catchAsync(room.join));

router.get("/:id", catchAsync(room.getOne));

router
  .route("/:id/pending")
  .post(catchAsync(room.accept))
  .delete(catchAsync(room.reject));

module.exports = router;
