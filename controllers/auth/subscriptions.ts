import asyncHandler from "express-async-handler";
import prisma from "../../prisma";
import { parseQuery } from "../../utils/prisma";

export const subscriptions = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Auth Profile"]
  // #swagger.summary = "Get subscriptions"
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

  const { id: authId } = res.locals.auth;

  const count = await prisma.channel.count({
    where: { subscribedBy: { some: { id: authId } } },
  });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.user
    .findUnique({
      where: {
        id: authId,
      },
    })
    .subscriptions({
      where: {
        name: {
          search,
        },
      },
      include: {
        _count: true,
      },
      skip,
      take,
      orderBy: {
        [sort]: order,
      },
    });

  res.status(200).json({
    data,
    currentPage,
    totalPage,
    count,
    message: "Subscriptions fetched",
  });
});
