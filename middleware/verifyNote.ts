import asyncHandler from "express-async-handler";
import Joi from "joi";
import prisma from "../prisma";
import { HttpException } from "../utils/error";
import { selectUserField } from "../utils/prisma";

const verifyNote = asyncHandler(async (req, res, next) => {
  try {
    const { id } = await Joi.object({
      id: Joi.number().required(),
    }).validateAsync(req.params);

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        channel: {
          include: {
            _count: true,
          },
        },
        user: {
          select: {
            ...selectUserField,
            _count: true,
          },
        },
        images: {
          select: {
            id: true,
            image: true,
            imageName: true,
          },
        },
        _count: true,
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
