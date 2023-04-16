import { Request } from "express";
import Joi from "joi";

// Exclude keys from user
export function exclude<Schema, Key extends keyof Schema>(
  schema: Schema,
  keys: Key[]
): Omit<Schema, Key> {
  for (let key of keys) {
    delete schema[key];
  }
  return schema;
}

interface ParseQueryReturn {
  skip: number;
  take: number;
  currentPage: number;
  totalPage: number;
  sort: string;
  order: "asc" | "desc" | { _count: "asc" | "desc" };
  search?: string;
}

export async function parseQuery(
  query: Request["query"],
  { count }: { count: number }
): Promise<ParseQueryReturn> {
  const countSort = ["subscribedBy", "followedBy", "likedBy"];

  const { page, size, search, sort, order } = await Joi.object({
    page: Joi.number().allow("").default(1),
    size: Joi.number().allow("").default(20),
    search: Joi.string().allow(""),
    sort: Joi.string()
      .valid("id", "createdAt", "name", ...countSort)
      .allow("")
      .default("id"),
    order: Joi.string().valid("asc", "desc").allow("").default("desc"),
  }).validateAsync(query);

  const skip = (page - 1) * (size || 20);

  const take = size;

  const currentPage = skip + 1;

  const totalPage = Math.ceil(count / take);

  return {
    skip,
    take,
    currentPage,
    totalPage,
    sort,
    order: countSort.includes(sort) ? { _count: order } : order,
    search: search && `${search}*`,
  };
}

export const selectUserField = {
  id: true,
  name: true,
  bio: true,
  image: true,
  imageName: true,
  social: true,
  createdAt: true,
  updatedAt: true,
};
