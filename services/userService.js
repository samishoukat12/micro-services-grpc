import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const UserServices = {
    CreateUser: async (call, callback) => {
    try {
      const user = await prisma.user.create({
        data: {
          name: call.request.name,
          email: call.request.email,
          password: call.request.password,
        },
      });

      console.log("✅ User created:", user);
      callback(null, { message: `User created: ${user.id}` });
    } catch (error) {
      if (error.code === "P2002") {
        // Prisma unique constraint error
        callback(null, { message: `User with email ${call.request.email} already exists.` });
      } else {
        console.error("❌ Unexpected error:", error);
        callback(null, { message: "Something went wrong while creating user." });
      }
    }
  },
    AllUsers: async (call, callback) => {
        const users = await prisma.user.findMany();
        callback(null, { users })
    }
}

export default UserServices
