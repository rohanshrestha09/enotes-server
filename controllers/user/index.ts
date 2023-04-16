import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { sign, Secret } from "jsonwebtoken";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidV4 } from "uuid";
import Joi from "joi";
import prisma from "../../prisma";
import UserSchema from "../../schema/user";
import { HttpException } from "../../utils/error";
import uploadFile from "../../utils/uploadFile";
import { CONTENT_TYPE, FILE_DIR } from "../../interface";

export const register = asyncHandler(async (req, res) => {
  // #swagger.tags = ["User"]
  // #swagger.summary = "Register"
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
                            email: {
                                type: "string"
                            },
                            password: {
                                type: "string",
                            },
                            confirmPassword: {
                                type: "string",
                            },
                            image: {
                                type: "string",
                                format: "binary"
                            }
                        },
                        required: ["name","email","password","confirmPassword"]
                    }
                }
            } 
        }
    */

  const { name, email, password } = await UserSchema.validateAsync(req.body);

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists)
    throw new HttpException(
      403,
      "User already exists. Choose a different email."
    );

  const salt = await bcrypt.genSalt(10);

  const encryptedPassword = await bcrypt.hash(password, salt);

  await prisma.user.create({
    data: {
      name,
      email,
      password: encryptedPassword,
    },
  });

  if (req.files) {
    const file = req.files.image as UploadedFile;

    if (!file.mimetype.startsWith(CONTENT_TYPE.IMAGE))
      throw new HttpException(403, "Please choose an image");

    const uuid = uuidV4();

    const filename = file.mimetype.replace(CONTENT_TYPE.IMAGE, `${uuid}.`);

    const fileUrl = await uploadFile(file, `${FILE_DIR.USERS}/${filename}`);

    await prisma.user.update({
      where: { email },
      data: { image: fileUrl, imageName: filename },
    });
  }

  const token = sign({ email }, process.env.JWT_TOKEN as Secret, {
    expiresIn: "30d",
  });

  res.status(201).json({ data: { token }, message: "Signup Successful" });
});

export const login = asyncHandler(async (req, res) => {
  // #swagger.tags = ["User"]
  // #swagger.summary = "Login"
  /* #swagger.security = [{
               "bearerAuth": []
  }] */
  /* #swagger.requestBody = {
            required: true,
            "@content": {
                "application/x-www-form-urlencoded": {
                    schema: {
                        type: "object",
                        properties: {
                            email: {
                                type: "string"
                            },
                            password: {
                                type: "string",
                            },
                        },
                        required: ["email","password"]
                    }
                }
            } 
        }
    */

  const { email, password } = await Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).validateAsync(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true },
  });

  if (!user) throw new HttpException(404, "User does not exist.");

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) throw new HttpException(403, "Incorrect Password");

  const token: string = sign({ email }, process.env.JWT_TOKEN as Secret, {
    expiresIn: "30d",
  });

  res.status(200).json({ data: { token }, message: "Login Successful" });
});

export const user = asyncHandler(async (req, res) => {
  // #swagger.tags = ["User"]
  // #swagger.summary = "Get user profile"
  /* #swagger.security = [{
               "bearerAuth": []
  }] */

  res.status(200).json({ data: res.locals.user, message: "User fetched" });
});
