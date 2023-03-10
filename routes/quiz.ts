import express from "express";
import * as quiz from "../controllers/quiz";
import {
  requireAuth,
  validateQuiz,
  validateId,
  validateAddQuiz,
} from "../middlewares";
import catchAsync from "../utils/catchAsync";

const router = express.Router();

router.use(catchAsync(requireAuth));

router
  .route("/")
  .get(catchAsync(quiz.getAll))
  .post(validateQuiz, catchAsync(quiz.create));

router.post("/publish", validateAddQuiz, catchAsync(quiz.publish));

router
  .route("/:id")
  .get(validateId, catchAsync(quiz.getOne))
  .put(validateId, catchAsync(quiz.edit))
  .post(validateId, catchAsync(quiz.submit))
  .delete(validateId, catchAsync(quiz.destroy));

export default router;
