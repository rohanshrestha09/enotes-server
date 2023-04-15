import asyncHandler from "express-async-handler";
import prisma from "../../prisma";

export const subscribe = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Channel"]
  // #swagger.summary = "Subscribe to a channel"
  /* #swagger.security = [{
               "bearerAuth": []
  }] */

  const { auth, channel } = res.locals;

  await prisma.channel.update({
    where: { id: channel.id },
    data: { subscribers: { connect: { id: auth.id } } },
  });

  res.status(201).json({ message: "Subscribed" });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Channel"]
  // #swagger.summary = "Unsubscribe to a channel"
  /* #swagger.security = [{
                 "bearerAuth": []
    }] */

  const { auth, channel } = res.locals;

  await prisma.channel.update({
    where: { id: channel.id },
    data: { subscribers: { disconnect: { id: auth.id } } },
  });

  res.status(201).json({ message: "Unsubscribed" });
});
