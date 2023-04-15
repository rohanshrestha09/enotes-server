import asyncHandler from "express-async-handler";
import prisma from "../../prisma";
import { parseQuery } from "../../utils/prisma";

export const followers = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Auth Profile"]
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

  const { id: authId } = res.locals.auth;

  const count = await prisma.user.count({
    where: { following: { some: { id: authId } } },
  });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.user
    .findUnique({
      where: {
        id: authId,
      },
    })
    .followedBy({
      where: {
        name: {
          search,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        social: true,
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
  // #swagger.tags = ["Auth Profile"]
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

  const { id: authId } = res.locals.auth;

  const count = await prisma.user.count({
    where: { followedBy: { some: { id: authId } } },
  });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.user
    .findUnique({
      where: {
        id: authId,
      },
    })
    .following({
      where: {
        name: {
          search,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        social: true,
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
