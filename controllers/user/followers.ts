import asyncHandler from "express-async-handler";
import prisma from "../../prisma";
import { parseQuery, selectUserField } from "../../utils/prisma";

export const followers = asyncHandler(async (req, res) => {
  // #swagger.tags = ["User"]
  // #swagger.summary = "Get followers"
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
                '@enum': ['id', 'createdAt','name', 'followedBy']
            }
    } */
  /*  #swagger.parameters['order'] = {
            in: 'query',
            schema: {
                '@enum': ['asc', 'desc']
            }
    } */

  const { id: userId } = res.locals.user;

  const count = await prisma.user.count({
    where: { following: { some: { id: userId } } },
  });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.user
    .findUnique({
      where: {
        id: userId,
      },
    })
    .followedBy({
      where: {
        name: {
          search,
        },
      },
      select: {
        ...selectUserField,
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
    message: "Followers fetched",
  });
});

export const following = asyncHandler(async (req, res) => {
  // #swagger.tags = ["User"]
  // #swagger.summary = "Get following"
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
                '@enum': ['id', 'createdAt','name', 'followedBy']
            }
    } */
  /*  #swagger.parameters['order'] = {
            in: 'query',
            schema: {
                '@enum': ['asc', 'desc']
            }
    } */

  const { id: userId } = res.locals.user;

  const count = await prisma.user.count({
    where: { followedBy: { some: { id: userId } } },
  });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.user
    .findUnique({
      where: {
        id: userId,
      },
    })
    .following({
      where: {
        name: {
          search,
        },
      },
      select: {
        ...selectUserField,
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
    message: "Following fetched",
  });
});
