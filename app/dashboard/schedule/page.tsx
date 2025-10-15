/**
 * /dashboard/schedule - Manage availability
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Navigation } from '@/src/shared/ui/navigation';
import { useAuthStore } from '@/src/shared/lib/store';

export default function SchedulePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (user.role !== 'MASTER') {
      router.push('/');
      return;
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        showBack={true}
        backUrl="/dashboard"
        backLabel="В кабинет"
        title="Расписание"
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Управление доступностью</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Функция управления расписанием в разработке. Добавьте доступность через API:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm font-mono">
              <div>POST /api/availability</div>
              <div className="mt-2 text-gray-600">
                {`{`}
                <br />
                &nbsp;&nbsp;"date": "2025-10-16",
                <br />
                &nbsp;&nbsp;"startMin": 540,
                <br />
                &nbsp;&nbsp;"endMin": 1080
                <br />
                {`}`}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
