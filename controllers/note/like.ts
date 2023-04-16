import asyncHandler from "express-async-handler";
import prisma from "../../prisma";
import { parseQuery, selectUserField } from "../../utils/prisma";

export const likes = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Note"]
  // #swagger.summary = "Get all likes"
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
                '@enum': ['id', 'createdAt', 'name', 'followedBy']
            }
    } */
  /*  #swagger.parameters['order'] = {
            in: 'query',
            schema: {
                '@enum': ['asc', 'desc']
            }
    } */

  const { id: noteId } = res.locals.note;

  const count = await prisma.user.count({
    where: { likes: { some: { id: noteId } } },
  });

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.note
    .findUnique({
      where: {
        id: noteId,
      },
    })
    .likedBy({
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

  res
    .status(200)
    .json({ data, currentPage, totalPage, count, message: "Likes fetched" });
});

export const like = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Note"]
  // #swagger.summary = "Like a note"
  /* #swagger.security = [{
               "bearerAuth": []
  }] */

  const { auth, note } = res.locals;

  await prisma.note.update({
    where: { id: note.id },
    data: { likedBy: { connect: { id: auth.id } } },
  });

  res.status(201).json({ message: "Liked" });
});

export const unlike = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Note"]
  // #swagger.summary = "Unlike a note"
  /* #swagger.security = [{
                 "bearerAuth": []
    }] */

  const { auth, note } = res.locals;

  await prisma.note.update({
    where: { id: note.id },
    data: { likedBy: { disconnect: { id: auth.id } } },
  });

  res.status(201).json({ message: "Unliked" });
});
