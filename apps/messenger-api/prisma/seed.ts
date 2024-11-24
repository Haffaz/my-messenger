import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        username: "john",
        password_hash: "$2a$12$LJnC8VThOsThRHFYkW2yqeEXu6CY5tr3djMTbvHxkahsort1Q6EjG",
      },
      {
        username: "jane",
        password_hash: "$2a$12$LJnC8VThOsThRHFYkW2yqeEXu6CY5tr3djMTbvHxkahsort1Q6EjG",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
