import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
    },
    {
      name: "Vivaan Patel",
      email: "vivaan.patel@example.com",
    },
    {
      name: "Aditya Verma",
      email: "aditya.verma@example.com",
    },
    {
      name: "Ishaan Joshi",
      email: "ishaan.joshi@example.com",
    },
    {
      name: "Krishna Rao",
      email: "krishna.rao@example.com",
    },
    {
      name: "Arjun Mehta",
      email: "arjun.mehta@example.com",
    },
    {
      name: "Rohan Singh",
      email: "rohan.singh@example.com",
    },
    {
      name: "Kabir Das",
      email: "kabir.das@example.com",
    },
    {
      name: "Rahul Kumar",
      email: "rahul.kumar@example.com",
    },
    {
      name: "Aryan Jain",
      email: "aryan.jain@example.com",
    },
    {
      name: "Ayaan Gupta",
      email: "ayaan.gupta@example.com",
    },
    {
      name: "Siddharth Naik",
      email: "siddharth.naik@example.com",
    },
    {
      name: "Dev Sharma",
      email: "dev.sharma@example.com",
    },
    {
      name: "Vikram Nair",
      email: "vikram.nair@example.com",
    },
    {
      name: "Yash Raj",
      email: "yash.raj@example.com",
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
