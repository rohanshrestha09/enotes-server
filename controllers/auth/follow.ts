import asyncHandler from "express-async-handler";
import prisma from "../../prisma";

export const follow = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Auth Profile"]
  // #swagger.summary = "Follow user"
  /* #swagger.security = [{
               "bearerAuth": []
  }] */

  const { auth, user } = res.locals;

  await prisma.user.update({
    where: { id: auth.id },
    data: { following: { connect: { id: user.id } } },
  });

  res.status(201).json({ message: "Followed" });
});

export const unfollow = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Auth Profile"]
  // #swagger.summary = "Unfollow user"
  /* #swagger.security = [{
                 "bearerAuth": []
    }] */

  const { auth, user } = res.locals;

  await prisma.user.update({
    where: { id: auth.id },
    data: { following: { disconnect: { id: user.id } } },
  });

  res.status(201).json({ message: "Unfollowed" });
});
