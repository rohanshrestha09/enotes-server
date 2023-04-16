import asyncHandler from "express-async-handler";
import Joi from "joi";
import prisma from "../prisma";
import { HttpException } from "../utils/error";

const verifyNote = asyncHandler(async (req, res, next) => {
  try {
    const { id } = await Joi.object({
      id: Joi.number().required(),
    }).validateAsync(req.params);

    const note = await prisma.notes.findUnique({
      where: { id },
      include: {
        _count: true,
        images: {
          select: {
            id: true,
            image: true,
            imageName: true,
          },
        },
      },
    });

    if (!note) throw new HttpException(404, "Note does not exist.");

    res.locals.note = note;

    next();
  } catch (err) {
    next(err);
  }
});

export default verifyNote;
