/**
 * Prisma seed script
 * Creates test data for development
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a master user
  const master = await prisma.user.upsert({
    where: { email: 'master@example.com' },
    update: {},
    create: {
      role: 'MASTER',
      email: 'master@example.com',
      name: 'Анна Иванова',
    },
  });

  console.log('Created master:', master);

  // Create services
  const service1 = await prisma.service.upsert({
    where: { id: 'service-1' },
    update: {},
    create: {
      id: 'service-1',
      masterId: master.id,
      title: 'Классический маникюр',
      description: 'Профессиональный маникюр с покрытием гель-лаком',
      durationMin: 60,
      priceCents: 150000, // 1500 RUB
      isActive: true,
    },
  });

  const service2 = await prisma.service.upsert({
    where: { id: 'service-2' },
    update: {},
    create: {
      id: 'service-2',
      masterId: master.id,
      title: 'Аппаратный маникюр',
      description: 'Аппаратный маникюр с укреплением ногтей',
      durationMin: 90,
      priceCents: 200000, // 2000 RUB
      isActive: true,
    },
  });

  const service3 = await prisma.service.upsert({
    where: { id: 'service-3' },
    update: {},
    create: {
      id: 'service-3',
      masterId: master.id,
      title: 'Педикюр',
      description: 'Классический педикюр с покрытием',
      durationMin: 75,
      priceCents: 180000, // 1800 RUB
      isActive: true,
    },
  });

  console.log('Created services:', { service1, service2, service3 });

  // Create availability for the next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    // Skip Sundays (day 0)
    if (date.getDay() === 0) continue;

    await prisma.availability.upsert({
      where: { id: `availability-${i}` },
      update: {},
      create: {
        id: `availability-${i}`,
        masterId: master.id,
        date: date,
        startMin: 540, // 9:00 AM (9 * 60)
        endMin: 1080,  // 6:00 PM (18 * 60)
        isBlocked: false,
      },
    });
  }

  console.log('Created availability for next 7 days (Mon-Sat)');

  // Create a test client
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      role: 'CLIENT',
      email: 'client@example.com',
      name: 'Мария Петрова',
    },
  });

  console.log('Created client:', client);

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

