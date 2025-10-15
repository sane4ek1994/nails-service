'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { Navigation } from '@/src/shared/ui/navigation';
import { Clock } from 'lucide-react';
import { formatPrice } from '@/src/shared/lib/utils';

interface Service {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  priceCents: number;
}

interface Master {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

interface MasterProfileProps {
  master: Master;
  services: Service[];
}

export function MasterProfile({ master, services }: MasterProfileProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        showBack={true}
        backUrl="/masters"
        backLabel="К списку мастеров"
        title={master.name || 'Мастер маникюра'}
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <p className="text-gray-600 mt-2">Выберите услугу для записи</p>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">Нет доступных услуг</p>
              <p className="text-sm">Мастер пока не добавил услуги</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  {service.description && (
                    <CardDescription>{service.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{service.durationMin} мин</span>
                    </div>
                    <div className="text-xl font-semibold text-gray-900">
                      {formatPrice(service.priceCents)}
                    </div>
                  </div>
                  <Link href={`/m/${master.id}/book?serviceId=${service.id}`}>
                    <Button className="w-full">Записаться</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

