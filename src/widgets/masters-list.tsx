'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { Navigation } from '@/src/shared/ui/navigation';
import { User } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  priceCents: number;
}

interface Master {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  servicesAsMaster: Service[];
}

interface MastersListProps {
  masters: Master[];
}

export function MastersList({ masters }: MastersListProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        showBack={true}
        backUrl="/"
        backLabel="На главную"
        title="Выберите мастера"
      />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:px-8">
        <div className="mb-8">
          <p className="text-gray-600">
            Выберите мастера для записи на услуги маникюра
          </p>
        </div>

        {masters.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Нет доступных мастеров</CardTitle>
              <CardDescription>
                В данный момент нет зарегистрированных мастеров. Пожалуйста, попробуйте позже.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {masters.map((master) => (
              <Card key={master.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {master.name || 'Мастер'}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {master.email || master.phone || 'Контакты не указаны'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {master.servicesAsMaster.length > 0 ? (
                      <>
                        <div className="text-sm text-gray-600">
                          <div className="font-medium mb-2">Услуги:</div>
                          <ul className="space-y-1">
                            {master.servicesAsMaster.slice(0, 2).map((service) => (
                              <li key={service.id} className="flex justify-between">
                                <span>{service.title}</span>
                                <span className="font-medium">
                                  {service.priceCents / 100} ₽
                                </span>
                              </li>
                            ))}
                            {master.servicesAsMaster.length > 2 && (
                              <li className="text-gray-500 italic">
                                и ещё {master.servicesAsMaster.length - 2}...
                              </li>
                            )}
                          </ul>
                        </div>

                        <Link href={`/m/${master.id}`} className="block">
                          <Button className="w-full">
                            Посмотреть услуги
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Нет доступных услуг
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

