/**
 * Home page - Landing page
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Button } from '@/src/shared/ui/button';
import { useAuthStore } from '@/src/shared/lib/store';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const setLoading = useAuthStore(state => state.setLoading);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Failed to check auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Маникюр PWA
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Современное решение для записи к мастеру маникюра
          </p>

          <div className="flex items-center justify-center gap-4">
            {user ? (
              <>
                {user.role === 'MASTER' ? (
                  <Link href="/dashboard">
                    <Button size="lg">Кабинет мастера</Button>
                  </Link>
                ) : (
                  <Link href="/masters">
                    <Button size="lg">Выбрать мастера</Button>
                  </Link>
                )}
                <Button size="lg" variant="outline" onClick={() => useAuthStore.getState().logout()}>
                  Выйти
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button size="lg">Войти</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card>
            <CardHeader>
              <Calendar className="h-12 w-12 text-gray-900 mb-4" />
              <CardTitle>Онлайн-запись</CardTitle>
              <CardDescription>
                Выбирайте удобное время и записывайтесь к мастеру в несколько кликов
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-12 w-12 text-gray-900 mb-4" />
              <CardTitle>Напоминания</CardTitle>
              <CardDescription>
                Добавляйте события в календарь iPhone/Android и не пропускайте запись
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-12 w-12 text-gray-900 mb-4" />
              <CardTitle>PWA</CardTitle>
              <CardDescription>
                Устанавливайте приложение на главный экран и работайте офлайн
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demo Section */}
        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Демо</CardTitle>
            <CardDescription className="text-gray-300">
              Для тестирования MVP используйте следующие данные
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Авторизация (development):</div>
              <div className="font-mono text-sm bg-gray-800 p-3 rounded-md">
                Любой email/телефон → код отображается в консоли сервера
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Создайте мастера и услуги через Prisma Studio:</div>
              <div className="font-mono text-sm bg-gray-800 p-3 rounded-md">
                npx prisma studio
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
