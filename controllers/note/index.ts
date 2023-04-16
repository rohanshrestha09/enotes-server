import asyncHandler from "express-async-handler";
import prisma from "../../prisma";
import Joi from "joi";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidV4 } from "uuid";
import uploadFile from "../../utils/uploadFile";
import { CONTENT_TYPE, FILE_DIR } from "../../interface";
import { HttpException } from "../../utils/error";
import { parseQuery } from "../../utils/prisma";

export const note = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Note"]
  // #swagger.summary = "Get note"
  /* #swagger.security = [{
                   "bearerAuth": []
      }] */

  res.status(200).json({ data: res.locals.note, message: "Note fetched" });
});

export const notes = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Note"]
  // #swagger.summary = "Get all notes"
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

  const count = await prisma.notes.count({});

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.notes.findMany({
    where: {
      name: search,
    },
    include: {
      _count: true,
      images: {
        select: {
          id: true,
          image: true,
          imageName: true,
        },
      },
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

export const createNote = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Note"]
  // #swagger.summary = "Create note"
  /* #swagger.security = [{
                 "bearerAuth": []
    }] */
  /* #swagger.parameters['id'] = {
        in: "path",
        description: "Channel id",
        required: true,
} */
  /* #swagger.requestBody = {
              required: true,
              "@content": {
                  "multipart/form-data": {
                      schema: {
                          type: "object",
                          properties: {
                              name: {
                                  type: "string"
                              },
                              description: {
                                  type: "string"
                              },
                                driveLink: {
                                  type: "string"
                              },
                              images: {
                                  type: "array",
                                  items:{
                                    type:"string",
                                    format: "binary"
                                  },
                              }
                          },
                          required: ["name","description"]
                      }
                  }
              } 
          }
      */

  const { id: channelId } = res.locals.channel;

  const { name, description, driveLink } = await Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    driveLink: Joi.string().uri({
      scheme: ["http", "https"],
    }),
    images: Joi.alternatives().try(
      Joi.array().items(Joi.binary()),
      Joi.string()
    ),
  }).validateAsync(req.body);

  const { id: noteId } = await prisma.notes.create({
    data: {
      channelId,
      name,
      description,
      driveLink,
    },
  });

  if (req.files) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const file of files) {
      if (!file.mimetype.startsWith(CONTENT_TYPE.IMAGE))
        throw new HttpException(403, "Please choose an image");

      const uuid = uuidV4();

      const filename = file.mimetype.replace(CONTENT_TYPE.IMAGE, `${uuid}.`);

      const fileUrl = await uploadFile(file, `${FILE_DIR.NOTES}/${filename}`);

      await prisma.noteImages.create({
        data: { noteId, image: fileUrl, imageName: filename },
      });
    }
  }

  res.status(201).json({ message: "Note created" });
});
