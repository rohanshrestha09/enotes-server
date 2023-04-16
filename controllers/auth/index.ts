import asyncHandler from "express-async-handler";
import Joi from "joi";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidV4 } from "uuid";
import prisma from "../../prisma";
import { HttpException } from "../../utils/error";
import uploadFile from "../../utils/uploadFile";
import deleteFile from "../../utils/deleteFile";
import { CONTENT_TYPE, FILE_DIR } from "../../interface";

export const authHandler = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Auth Profile"]
  // #swagger.summary = "Get auth profile"
  /* #swagger.security = [{
               "bearerAuth": []
  }] */

  res.status(200).json({ data: res.locals.auth, message: "Auth user fetched" });
});

export const updateProfile = asyncHandler(async (req, res) => {
  // #swagger.tags = ["Auth Profile"]
  // #swagger.summary = "Update auth profile"
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
                            bio: {
                                type: "string"
                            },
                            social: {
                                type: "object",
                                properties:{
                                  facebook:{
                                    type:"string",
                                  },
                                  google:{
                                    type:"string",
                                  }
                                }
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

  const { id: authId, image, imageName } = res.locals.auth;

  const { name, bio, social } = await Joi.object({
    name: Joi.string(),
    bio: Joi.string(),
    social: Joi.object({
      facebook: Joi.string().domain(),
      google: Joi.string().domain(),
    }),
    image: Joi.binary(),
  }).validateAsync({
    ...req.body,
    social: req.body.social && JSON.parse(req.body.social),
  });

  if (req.files) {
    const file = req.files.image as UploadedFile;

    if (!file.mimetype.startsWith(CONTENT_TYPE.IMAGE))
      throw new HttpException(403, "Please choose an image");

    if (image && imageName) deleteFile(`${FILE_DIR.USERS}/${imageName}`);

    const uuid = uuidV4();

    const filename = file.mimetype.replace(CONTENT_TYPE.IMAGE, `${uuid}.`);

    const fileUrl = await uploadFile(file, `${FILE_DIR.USERS}/${filename}`);

    await prisma.user.update({
      where: { id: authId },
      data: { image: fileUrl, imageName: filename },
    });
  }

  await prisma.user.update({
    where: { id: authId },
    data: { name, bio, social },
  });

  res.status(201).json({ message: "Profile updated" });
});
