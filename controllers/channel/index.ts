import asyncHandler from "express-async-handler";
import Joi from "joi";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidV4 } from "uuid";
import prisma from "../../prisma";
import { HttpException } from "../../utils/error";
import uploadFile from "../../utils/uploadFile";
import deleteFile from "../../utils/deleteFile";
import { CONTENT_TYPE, FILE_DIR } from "../../interface";
import { parseQuery } from "../../utils/prisma";

export const channel = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Channel"]
  // #swagger.summary = "Get single channel"
  /* #swagger.security = [{
                 "bearerAuth": []
    }] */

  res
    .status(200)
    .json({ data: res.locals.channel, message: "Channel fetched" });
});

export const channels = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Channel"]
  // #swagger.summary = "Get all channels"
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

  const count = await prisma.channel.count({});

  const { currentPage, totalPage, search, skip, take, sort, order } =
    await parseQuery(req.query, { count });

  const data = await prisma.channel.findMany({
    where: {
      name: search,
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

  res
    .status(200)
    .json({ data, currentPage, totalPage, count, message: "Channels fetched" });
});

export const createChannel = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Channel"]
  // #swagger.summary = "Create channel"
  /* #swagger.security = [{
               "bearerAuth": []
  }] */
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
                            image: {
                                type: "string",
                                format: "binary"
                            }
                        },
                        required: ["name","description"]
                    }
                }
            } 
        }
    */

  const { id: userId } = res.locals.auth;

  const { name, description } = await Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.binary(),
  }).validateAsync(req.body);

  const { id: channelId } = await prisma.channel.create({
    data: {
      userId,
      name,
      description,
    },
  });

  if (req.files) {
    const file = req.files.image as UploadedFile;

    if (!file.mimetype.startsWith(CONTENT_TYPE.IMAGE))
      throw new HttpException(403, "Please choose an image");

    const uuid = uuidV4();

    const filename = file.mimetype.replace(CONTENT_TYPE.IMAGE, `${uuid}.`);

    const fileUrl = await uploadFile(file, `${FILE_DIR.CHANNELS}/${filename}`);

    await prisma.channel.update({
      where: { id: channelId },
      data: { image: fileUrl, imageName: filename },
    });
  }

  res.status(201).json({ message: "Channel created" });
});

export const updateChannel = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Channel"]
  // #swagger.summary = "Update channel"
  /* #swagger.security = [{
               "bearerAuth": []
  }] */
  /* #swagger.requestBody = {
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
                            image: {
                                type: "string",
                                format: "binary"
                            }
                        },
                    }
                }
            } 
        }
    */

  const { id: channelId, image, imageName } = res.locals.channel;

  const { name, description } = await Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    image: Joi.binary(),
  }).validateAsync(req.body);

  if (req.files) {
    const file = req.files.image as UploadedFile;

    if (!file.mimetype.startsWith(CONTENT_TYPE.IMAGE))
      throw new HttpException(403, "Please choose an image");

    if (image && imageName) deleteFile(`${FILE_DIR.CHANNELS}/${imageName}`);

    const uuid = uuidV4();

    const filename = file.mimetype.replace(CONTENT_TYPE.IMAGE, `${uuid}.`);

    const fileUrl = await uploadFile(file, `${FILE_DIR.CHANNELS}/${filename}`);

    await prisma.channel.update({
      where: { id: channelId },
      data: { image: fileUrl, imageName: filename },
    });
  }

  await prisma.channel.update({
    where: { id: channelId },
    data: { name, description },
  });

  res.status(201).json({ message: "Channel updated" });
});
