import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      rooms: {
        create: {
          name: "Aarav's Room",
          description: "A coding haven for Aarav Sharma",
        },
      },
    },
    {
      name: "Vivaan Patel",
      email: "vivaan.patel@example.com",
      rooms: {
        create: {
          name: "Vivaan's Room",
          description: "Vivaan Patel's creative space",
        },
      },
    },
    // ... other users
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { email: user.email },
        data: user,
      });
      console.log(`Updated user: ${user.name}`);
    } else {
      await prisma.user.create({
        data: user,
      });
      console.log(`Created user and room for: ${user.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
