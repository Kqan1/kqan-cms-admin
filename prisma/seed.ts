import { hash } from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    const password = await hash("test", 12);
    const userUSER = await prisma.user.upsert({
        where: { email: "test@user.com" },
        update: {},
        create: {
            email: "test@user.com",
            username: "UserAccount",
            password,
            banner: "banner user",
            role: UserRole.USER
        },
    });
    const UserADMIN = await prisma.user.upsert({
        where: { email: "test@admin.com" },
        update: {},
        create: {
            email: "test@admin.com",
            username: "AdminAccount",
            password,
            banner: "banner admin",
            role: UserRole.ADMIN,
            emailVerified: new Date(),
        },
    });
    console.log(`Database has been seeded. 🌱`);
}
seed()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });