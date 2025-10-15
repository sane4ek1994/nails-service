/**
 * /masters - Masters list page
 * For clients to choose a master
 */

import { prisma } from '@/src/shared/lib/prisma';
import { MastersList } from '@/src/widgets/masters-list';

export default async function MastersPage() {
  const masters = await prisma.user.findMany({
    where: {
      role: 'MASTER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      servicesAsMaster: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
          title: true,
          priceCents: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return <MastersList masters={masters} />;
}
