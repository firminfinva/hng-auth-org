import request from "supertest";
import { server } from "./../src/index.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.organisation.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
const theuser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "password123",
};

let userId = [];
let globalaccessToken = "";

describe("POST /auth/register", () => {
  it("should register user successfully with default organisation", async () => {
    const res = await request(server).post("/auth/register").send(theuser);

    expect(res.statusCode).toEqual(201); // Expecting 201 for success
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("message", "Registration successful");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data.user).toHaveProperty("firstName", theuser.firstName);
    expect(res.body.data.user).toHaveProperty("lastName", theuser.lastName);
    expect(res.body.data.user).toHaveProperty("email", theuser.email);

    const userInDb = await prisma.user.findUnique({
      where: { email: theuser.email },
    });
    globalaccessToken = res.body.data.accessToken;

    // console.log("userInDb", userInDb);
    // expect(userInDb).not.toBeNull();
    // expect(userInDb.organisation).not.toBeNull();
    // expect(userInDb.organisation.name).toBe(
    //   `${userData.firstName}'s Organisation`
    // );
    // console.log("user org", userInDb.organisation);
  });

  it("Default Organisation", async () => {
    const res = await request(server)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${globalaccessToken}`);
    console.log("res", res.body.data);
    const organisationName = res.body.data.organisations.some(
      (name) => name.name === `${theuser.firstName}'s organisation`
    );
    expect(res.status).toEqual(200);
    expect(organisationName).toBe(true);
  });

  it("should log the user in successfully", async () => {
    // Register a user first
    await request(server).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    // Then attempt login
    const loginRes = await request(server).post("/auth/login").send({
      email: "jane.doe@example.com",
      password: "password123",
    });

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty("status", "success");
    expect(loginRes.body).toHaveProperty("message", "Login successful");
    expect(loginRes.body).toHaveProperty("data");
    expect(loginRes.body.data).toHaveProperty("accessToken");
    expect(loginRes.body.data).toHaveProperty("user");
    expect(loginRes.body.data.user).toHaveProperty("firstName", "Jane");
    expect(loginRes.body.data.user).toHaveProperty("lastName", "Doe");
    expect(loginRes.body.data.user).toHaveProperty(
      "email",
      "jane.doe@example.com"
    );
    expect(loginRes.body.data.user).toHaveProperty("phone", null); // Adjust as per actual structure
  });
  it("should fail if required fields are missing", async () => {
    const res = await request(server).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      // Missing 'email' intentionally to trigger error
    });

    expect(res.statusCode).toEqual(422); // Adjusted to 422 for missing fields
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0]).toHaveProperty("field", "email");
    expect(res.body.errors[0]).toHaveProperty("message", "Email is required");
  });

  it("should fail if there is a duplicate email", async () => {
    // Register a user with the same email first
    await request(server).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    // Attempt to register the same email again
    const duplicateRes = await request(server).post("/auth/register").send({
      firstName: "John",
      lastName: "Smith",
      email: "jane.doe@example.com", // This email should already exist
      password: "anotherPassword",
    });

    expect(duplicateRes.statusCode).toEqual(422); // Expecting 422 for duplicate email
    // expect(duplicateRes.body).toHaveProperty("status", "error");
    expect(duplicateRes.body).toHaveProperty("message", "Email already exists");
  });
});
