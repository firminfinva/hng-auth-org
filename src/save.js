// app.js
const express = require("express");
const prisma = require("./prisma");
const app = express();

app.use(express.json());

// Endpoint to create a user
app.post("/users", async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        phone,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
});

// Endpoint to add user to an organisation
app.post("/user-organisations", async (req, res) => {
  const { userId, orgId } = req.body;

  try {
    const user = await prisma.user.update({
      where: { userId },
      data: {
        organisations: {
          connect: { orgId },
        },
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "An error occurred while adding the user to the organisation",
      });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create a new Organisation
  const organisation = await prisma.organisation.create({
    data: {
      name: "Awesome Organisation",
      description: "This is an awesome organisation.",
    },
  });

  // Create a new User and link to the created Organisation
  const user = await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      organisations: {
        connect: {
          orgId: organisation.orgId,
        },
      },
    },
  });

  // Fetch the user along with the organisations they are connected to
  const userWithOrganisations = await prisma.user.findUnique({
    where: { userId: user.userId },
    include: { organisations: true },
  });

  console.log(userWithOrganisations);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
