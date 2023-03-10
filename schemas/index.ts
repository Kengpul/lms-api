import Joi from "joi";

export const postSchema = Joi.object({
  content: Joi.string().required(),
  likes: Joi.array().items({
    name: Joi.string().required(),
    date: Joi.date().required(),
  }),
  comments: Joi.array().items({
    name: Joi.string().required(),
    content: Joi.string().required(),
    date: Joi.date().required(),
  }),
  rooms: Joi.array().items(
    Joi.object({
      value: Joi.string().required(),
      label: Joi.string().required(),
    }).required()
  ),
});

export const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  type: Joi.string().valid("Student").valid("Teacher").required(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const createRoomSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
});

export const roomLinkSchema = Joi.object({
  attendance: Joi.string().allow("").uri().optional(),
  meeting: Joi.string().allow("").uri().optional(),
});

export const quizSchema = Joi.object({
  title: Joi.string().required(),
  due: Joi.string().required(),
  quizzes: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      choices: Joi.array().items({
        answer: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
      }),
    }).required()
  ),
});

export const publishQuizSchema = Joi.object({
  selectedRooms: Joi.array().items(
    Joi.object({
      label: Joi.string().required(),
      value: Joi.string().required(),
    }).required()
  ),
  selectedQuizzes: Joi.array().items(
    Joi.object({
      label: Joi.string().required(),
      value: Joi.string().required(),
    }).required()
  ),
});
