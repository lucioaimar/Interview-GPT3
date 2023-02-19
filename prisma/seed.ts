import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.framework.createMany({
    data: [
      {
        name: "React",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/800px-React.svg.png",
      },
      {
        name: "Angular",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png",
      },
      {
        name: "Vue.js",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png",
      },
      {
        name: "Svelte",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png",
      },
      {
        name: "Android Native Development",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Android_Studio_Icon_3.6.svg/1900px-Android_Studio_Icon_3.6.svg.png",
      },
      {
        name: "iOS Native Development",
        image:
          "https://img.favpng.com/23/5/17/swift-mobile-app-development-programming-language-computer-programming-software-developer-png-favpng-KadqxiWKtq7HRt641S4aQfkC6.jpg",
      },
      {
        name: "FastAPI",
        image:
          "https://upload.wikimedia.org/wikiversity/en/8/8c/FastAPI_logo.png",
      },
    ],
    skipDuplicates: true,
  });
  await prisma.seniority.createMany({
    data: [
      {
        name: "Junior",
      },
      {
        name: "Intermediate",
      },
      {
        name: "Senior",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
