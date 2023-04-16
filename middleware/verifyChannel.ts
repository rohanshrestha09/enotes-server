import asyncHandler from "express-async-handler";
import Joi from "joi";
import prisma from "../prisma";
import { HttpException } from "../utils/error";
import { selectUserField } from "../utils/prisma";

const verifyChannel = asyncHandler(async (req, res, next) => {
  try {
    const { id } = await Joi.object({
      id: Joi.number().required(),
    }).validateAsync(req.params);

    const channel = await prisma.channel.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            ...selectUserField,
            _count: true,
          },
        },
        _count: true,
      },
    });

    if (!channel) throw new HttpException(404, "Channel does not exist.");

    res.locals.channel = channel;

    next();
  } catch (err) {
    next(err);
  }
});

export default verifyChannel;
