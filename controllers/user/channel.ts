import asyncHandler from "express-async-handler";
import prisma from "../../prisma";
import { parseQuery, selectUserField } from "../../utils/prisma";

export const channels = asyncHandler(async (req, res) => {
  // #swagger.tags = ["User"]
  // #swagger.summary = "Get channels"
  /* #swagger.security = [{
                 "bearerAuth": []
    }] */
  /* #swagger.parameters['page'] = {
          in: "query",
          type: "integer",
      } */
  /* #swagger.parameters['size'] = {
          in: "query",
          type: "integer",
      } */
  /* #swagger.parameters['search'] = {
          in: "query",
          type: "string",
      } */
  /*  #swagger.parameters['sort'] = {
            in: 'query',
            schema: {
                '@enum': ['id', 'createdAt', 'subscribedBy']
            }
    } */
  /*  #swagger.parameters['order'] = {
            in: 'query',
            schema: {
                '@enum': ['asc', 'desc']
            }
    } */

  const { id: userId } = res.locals.user;

  const count = await prisma.channel.count({
    where: { userId },
  });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.channel.findMany({
    where: {
      userId,
      name: { search },
    },
    include: {
      user: {
        select: {
          ...selectUserField,
          _count: true,
        },
      },
      _count: true,
    },
    skip,
    take,
    orderBy: {
      [sort]: order,
    },
  });

  res
    .status(200)
    .json({ data, currentPage, totalPage, count, message: "Channels fetched" });
});
