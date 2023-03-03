import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync";
import {
  requireAuth,
  validateCreateRoom,
  uniqueRoom,
  validateLinks,
  validateId,
  isTeacher,
} from "../middlewares/";
import * as room from "../controllers/room";

router.use(catchAsync(requireAuth));

router
  .route("/")
  .get(catchAsync(room.getAll))
  .post(
    catchAsync(isTeacher),
    validateCreateRoom,
    catchAsync(uniqueRoom),
    catchAsync(room.create)
  );

router.post("/join", catchAsync(room.join));

router
  .route("/:id")
  .get(validateId, catchAsync(room.getPosts))
  .post(validateId, catchAsync(room.getOne))
  .put(validateId, catchAsync(isTeacher), validateLinks, catchAsync(room.links))
  .delete(validateId, catchAsync(room.leave));

router
  .route("/:id/pending")
  .post(validateId, catchAsync(room.accept))
  .delete(validateId, catchAsync(room.reject));

export default router
