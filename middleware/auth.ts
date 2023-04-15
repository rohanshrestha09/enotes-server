import { JwtPayload, Secret, verify } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import prisma from "../prisma";
import { HttpException } from "../utils/error";
import { exclude } from "../utils/prisma";

const auth = asyncHandler(async (req, res, next) => {
  try {
    if (!req.headers.authorization?.startsWith("Bearer"))
      throw new HttpException(401, "Invalid token");

    const [_, token] = req.headers.authorization.split(" ");

    const { email } = verify(token, process.env.JWT_TOKEN as Secret) as JwtPayload;

    const auth = await prisma.user.findUnique({ where: { email }, include: { _count: true } });

    if (!auth) throw new HttpException(404, "User does not exist");

    res.locals.auth = exclude(auth, ["password"]);

    next();
  } catch (err) {
    next(err);
  }
});

export default auth;
