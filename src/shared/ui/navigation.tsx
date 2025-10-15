'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from './button';
import { ArrowLeft, Home, LogOut } from 'lucide-react';
import { useAuthStore } from '@/src/shared/lib/store';

interface NavigationProps {
  showBack?: boolean;
  backUrl?: string;
  backLabel?: string;
  showHome?: boolean;
  showLogout?: boolean;
  title?: string;
}

export function Navigation({
  showBack = false,
  backUrl,
  backLabel = 'Назад',
  showHome = true,
  showLogout = true,
  title,
}: NavigationProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {showBack && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backLabel}
              </Button>
            )}
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {showHome && (
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Главная
                </Button>
              </Link>
            )}
            
            {user && user.role === 'MASTER' && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Кабинет
                </Button>
              </Link>
            )}

            {user && user.role === 'CLIENT' && (
              <Link href="/masters">
                <Button variant="ghost" size="sm">
                  Мастера
                </Button>
              </Link>
            )}

            {user && showLogout && (
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            )}

            {!user && (
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Войти
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

