import asyncHandler from "express-async-handler";
import prisma from "../../prisma";
import { parseQuery, selectUserField } from "../../utils/prisma";

export const notes = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Auth Profile"]
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
                    '@enum': ['id', 'createdAt', 'likedBy']
                }
        } */
  /*  #swagger.parameters['order'] = {
                in: 'query',
                schema: {
                    '@enum': ['asc', 'desc']
                }
        } */

  const { id: authId } = res.locals.auth;

  const count = await prisma.note.count({
    where: { userId: authId },
  });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.note.findMany({
    where: {
      userId: authId,
      name: search,
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
          id: true,
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

  res
    .status(200)
    .json({ data, currentPage, totalPage, count, message: "Notes fetched" });
});

export const likes = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Auth Profile"]
  // #swagger.summary = "Get liked notes"
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
                '@enum': ['id', 'createdAt', 'name', 'likedBy']
            }
    } */
  /*  #swagger.parameters['order'] = {
            in: 'query',
            schema: {
                '@enum': ['asc', 'desc']
            }
    } */

  const { id: authId } = res.locals.auth;

  const count = await prisma.note.count({
    where: { likedBy: { some: { id: authId } } },
  });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.user
    .findUnique({
      where: {
        id: authId,
      },
    })
    .likes({
      where: {
        name: search,
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
            id: true,
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

  res
    .status(200)
    .json({ data, currentPage, totalPage, count, message: "Notes fetched" });
});
