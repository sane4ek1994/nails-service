/**
 * /m/[masterId] - Master public profile page
 * Display master's services
 */

import { notFound } from 'next/navigation';
import { prisma } from '@/src/shared/lib/prisma';
import { MasterProfile } from '@/src/widgets/master-profile';

interface MasterPageProps {
  params: Promise<{ masterId: string }>;
}

export default async function MasterPage({ params }: MasterPageProps) {
  const { masterId } = await params;

  const master = await prisma.user.findUnique({
    where: { id: masterId, role: 'MASTER' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  if (!master) {
    notFound();
  }

  const services = await prisma.service.findMany({
    where: {
      masterId,
      isActive: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return <MasterProfile master={master} services={services} />;
}
