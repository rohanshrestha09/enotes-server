import request from "supertest";
import app from "../app";
import prisma from "../prisma";

const USER_REQUEST = "/api/v1/user";

const EMAIL = "rohan@gmail.com";

const PASSWORD = "rohan123";

const USER_ID = 1;

afterAll(async () => {
  await prisma.user.delete({ where: { email: EMAIL } });
});

describe("User API", () => {
  test("POST /user/register -> Register user", async () => {
    const response = await request(app)
      .post(USER_REQUEST + "/register")
      .send({
        name: "Rohan",
        email: EMAIL,
        password: PASSWORD,
        confirmPassword: PASSWORD,
        bio: "very nice",
      });

    expect(response.statusCode).toBe(201);
  });

  test("POST /user/login -> Login user", async () => {
    const response = await request(app)
      .post(USER_REQUEST + "/login")
      .send({ email: EMAIL, password: PASSWORD });

    expect(response.statusCode).toBe(200);
  });

  test("GET /user/:id -> Get a user", async () => {
    const response = await request(app).get(`${USER_REQUEST}/${USER_ID}`);

    expect(response.statusCode).toBe(200);
  });

  test("GET /user/:id/channel -> Get user's channel", async () => {
    const response = await request(app).get(
      `${USER_REQUEST}/${USER_ID}/channel`
    );

    expect(response.statusCode).toBe(200);

    expect(response.body.data).toBeInstanceOf(Array);
  });

  test("GET /user/:id/followers -> Get user's followers", async () => {
    const response = await request(app).get(
      `${USER_REQUEST}/${USER_ID}/followers`
    );

    expect(response.statusCode).toBe(200);

    expect(response.body.data).toBeInstanceOf(Array);
  });

  test("GET /user/:id/following -> Get user's following", async () => {
    const response = await request(app).get(
      `${USER_REQUEST}/${USER_ID}/following`
    );

    expect(response.statusCode).toBe(200);

    expect(response.body.data).toBeInstanceOf(Array);
  });

  test("GET /user/:id/note -> Get user's note", async () => {
    const response = await request(app).get(`${USER_REQUEST}/${USER_ID}/note`);

    expect(response.statusCode).toBe(200);

    expect(response.body.data).toBeInstanceOf(Array);
  });
});
