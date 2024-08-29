import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      password: "password123",
    },
    {
      name: "Vivaan Patel",
      email: "vivaan.patel@example.com",
      password: "password123",
    },
    {
      name: "Aditya Verma",
      email: "aditya.verma@example.com",
      password: "password123",
    },
    {
      name: "Ishaan Joshi",
      email: "ishaan.joshi@example.com",
      password: "password123",
    },
    {
      name: "Krishna Rao",
      email: "krishna.rao@example.com",
      password: "password123",
    },
    {
      name: "Arjun Mehta",
      email: "arjun.mehta@example.com",
      password: "password123",
    },
    {
      name: "Rohan Singh",
      email: "rohan.singh@example.com",
      password: "password123",
    },
    {
      name: "Kabir Das",
      email: "kabir.das@example.com",
      password: "password123",
    },
    {
      name: "Rahul Kumar",
      email: "rahul.kumar@example.com",
      password: "password123",
    },
    {
      name: "Aryan Jain",
      email: "aryan.jain@example.com",
      password: "password123",
    },
    {
      name: "Ayaan Gupta",
      email: "ayaan.gupta@example.com",
      password: "password123",
    },
    {
      name: "Siddharth Naik",
      email: "siddharth.naik@example.com",
      password: "password123",
    },
    {
      name: "Dev Sharma",
      email: "dev.sharma@example.com",
      password: "password123",
    },
    {
      name: "Vikram Nair",
      email: "vikram.nair@example.com",
      password: "password123",
    },
    {
      name: "Yash Raj",
      email: "yash.raj@example.com",
      password: "password123",
    },
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
      console.log(`Created user: ${user.name}`);
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
