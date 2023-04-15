import asyncHandler from "express-async-handler";
import Joi from "joi";
import prisma from "../prisma";
import { HttpException } from "../utils/error";
import { exclude } from "../utils/prisma";

const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = await Joi.object({ id: Joi.number().required() }).validateAsync(req.params);

    const user = await prisma.user.findUnique({ where: { id }, include: { _count: true } });

    if (!user) throw new HttpException(404, "User does not exist.");

    res.locals.user = exclude(user, ["password", "email", "provider"]);

    next();
  } catch (err) {
    next(err);
  }
});

export default verifyUser;
