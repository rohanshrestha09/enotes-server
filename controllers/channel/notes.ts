import asyncHandler from "express-async-handler";
import prisma from "../../prisma";
import { parseQuery, selectUserField } from "../../utils/prisma";

export const notes = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Channel"]
  // #swagger.summary = "Get notes"
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
                '@enum': ['id', 'createdAt','name', 'likedBy']
            }
    } */
  /*  #swagger.parameters['order'] = {
            in: 'query',
            schema: {
                '@enum': ['asc', 'desc']
            }
    } */

  const { id: channelId } = res.locals.channel;

  const count = await prisma.note.count({ where: { channelId } });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.note.findMany({
    where: {
      channelId,
      name: {
        search,
      },
    },
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
          image: true,
          imageName: true,
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

  res.status(200).json({
    data,
    currentPage,
    totalPage,
    count,
    message: "Notes fetched",
  });
});
