import prisma from "./../dbconnexion.js";

export async function GetUser(req, res) {
  try {
    let theuser = await prisma.user.findUnique({
      where: {
        userId: req.params.id,
      },
    });

    res.status(200).json({
      status: "success",
      message: "<message>",
      data: {
        userId: theuser.userId,
        firstName: theuser.firstName,
        lastName: theuser.lastName,
        email: theuser.email,
        phone: theuser.phone,
      },
    });
  } catch (error) {
    res.json({ error: error.stack });
  }
}
