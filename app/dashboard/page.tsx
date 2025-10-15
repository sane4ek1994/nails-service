/**
 * /dashboard - Master dashboard
 * View and manage appointments
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { Loading } from '@/src/shared/ui/loading';
import { Navigation } from '@/src/shared/ui/navigation';
import { useAuthStore } from '@/src/shared/lib/store';
import { Calendar, Settings, List } from 'lucide-react';

interface Appointment {
  id: string;
  dateTime: string;
  durationMin: number;
  status: string;
  service: {
    title: string;
    priceCents: number;
  };
  client: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

    loadAppointments();
  }, [user, router]);

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
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
        backUrl="/"
        backLabel="На главную"
        title="Кабинет мастера"
      />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <p className="text-gray-600">Добро пожаловать, {user?.name || 'Мастер'}!</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Link href="/dashboard/services">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <Settings className="h-8 w-8 text-gray-600" />
                <div>
                  <div className="font-semibold">Услуги</div>
                  <div className="text-sm text-gray-500">Управление услугами</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/schedule">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <Calendar className="h-8 w-8 text-gray-600" />
                <div>
                  <div className="font-semibold">Расписание</div>
                  <div className="text-sm text-gray-500">Доступность</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gray-900 text-white">
            <CardContent className="flex items-center gap-4 p-6">
              <List className="h-8 w-8" />
              <div>
                <div className="font-semibold">Записи</div>
                <div className="text-sm text-gray-300">{appointments.length} записей</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Последние записи</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Нет записей</p>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 10).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{apt.service.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {apt.client.name || apt.client.phone || apt.client.email || 'Клиент'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(apt.dateTime).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(apt.dateTime).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'booked'
                            ? 'bg-blue-100 text-blue-700'
                            : apt.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : apt.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {apt.status}
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

