// import { PrismaClient } from "@prisma/client"; // importing prismaclient from prisma package
// const globalForPrisma = global as unknown as { prisma?: PrismaClient}; // defining a global variable to store our prisma client
// export const prisma = globalForPrisma.prisma || new PrismaClient(); // checking is globalforprisma exists, if yes we use existing instance, if not we create a new instance newPrismaClient();
// if (process.env.NODE_ENV != "production") globalForPrisma.prisma = prisma; // prevents issues: stores the prisma instance in global only in development (preventing too many prisma clients in dev.)
