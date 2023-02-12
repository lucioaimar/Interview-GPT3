/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.framework.createMany({
    data: [
      {
        name: 'React',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/800px-React.svg.png',
      },
      {
        name: 'Angular',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png',
      },
      {
        name: 'Vue.js',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png',
      },
      {
        name: 'Svelte',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png',
      },
    ],
    skipDuplicates: true,
  });
  await prisma.seniority.createMany({
    data: [
      {
        name: 'Junior',
      },
      {
        name: 'Intermediate',
      },
      {
        name: 'Senior',
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
