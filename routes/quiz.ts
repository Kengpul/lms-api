import express from "express";
import * as quiz from "../controllers/quiz";
import { requireAuth, validateQuiz } from "../middlewares";
import catchAsync from "../utils/catchAsync";

const router = express.Router();

router.use(catchAsync(requireAuth));

router.post("/", validateQuiz, catchAsync(quiz.create));

export default router;
