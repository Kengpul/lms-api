import express from "express";
import * as quiz from "../controllers/quiz";
import { requireAuth, validateQuiz, validateId } from "../middlewares";
import catchAsync from "../utils/catchAsync";

const router = express.Router();

router.use(catchAsync(requireAuth));

router
  .route("/")
  .get(catchAsync(quiz.getAll))
  .post(validateQuiz, catchAsync(quiz.create));

router.get("/:id", validateId, catchAsync(quiz.getOne));

export default router;
