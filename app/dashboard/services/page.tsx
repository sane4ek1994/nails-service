/**
 * /dashboard/services - Manage services
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { Loading } from '@/src/shared/ui/loading';
import { Navigation } from '@/src/shared/ui/navigation';
import { useAuthStore } from '@/src/shared/lib/store';
import { formatPrice } from '@/src/shared/lib/utils';
import { Plus, Edit, Trash } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description?: string;
  durationMin: number;
  priceCents: number;
  isActive: boolean;
}

export default function ServicesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (user.role !== 'MASTER') {
      router.push('/');
      return;
    }

    loadServices();
  }, [user, router]);

  const loadServices = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/services?masterId=${user.id}`);
      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        showBack={true}
        backUrl="/dashboard"
        backLabel="В кабинет"
        title="Услуги"
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

        <Card>
          <CardHeader>
            <CardTitle>Список услуг</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Услуги пока не добавлены. Создайте услугу через API или админ-панель.
              </p>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{service.title}</div>
                        {service.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {service.description}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="text-gray-600">
                            Длительность: {service.durationMin} мин
                          </span>
                          <span className="font-semibold">
                            {formatPrice(service.priceCents)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {service.isActive ? 'Активна' : 'Неактивна'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

