import prisma from "./../dbconnexion.js";

export async function CreateOrganisation(req, res) {
  try {
    const newOrganisation = await prisma.organisation.create({
      data: req.body,
    });
    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: newOrganisation,
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
}

export async function GetAllOrganisations(req, res) {
  try {
    let allOrganisations = await prisma.organisation.findMany({
      select: {
        orgId: true,
        name: true,
        description: true,
      },
    });
    res.status(200).json({
      status: "success",
      message: "<message>",
      data: {
        organisations: allOrganisations,
      },
    });
  } catch (error) {
    res.json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
}

export async function GetOrganisation(req, res) {
  try {
    let organiation = await prisma.organisation.findUnique({
      where: {
        orgId: req.params.orgId,
      },
    });

    res.status(200).json({
      status: "success",
      message: "<message>",
      data: organiation,
    });
  } catch (error) {
    res.json({ error: error.stack });
  }
}

export async function AddUserToOrganisation(req, res) {
  try {
    const existingOrg = await prisma.organisation.findUnique({
      where: { orgId: req.params.orgId },
    });
    const existingUser = await prisma.user.findUnique({
      where: { userId: req.body.userId },
    });
    if (existingOrg && existingUser) {
      const updatedUser = await prisma.user.update({
        where: { email: existingUser.email },
        data: {
          organisations: {
            connect: { orgId: existingOrg.orgId },
          },
        },
      });
    }
    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "something went wrong",
      message: "User was not  added to organisation successfully",
    });
  }
}
