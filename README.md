# Маникюр PWA

Веб-PWA приложение для мастера маникюра и его клиентов. Клиенты видят услуги и свободные слоты, создают запись, получают напоминания и добавляют событие в календарь (iOS/Android). Мастер управляет расписанием, услугами и записями.

## Технологии

- **Frontend**: TypeScript, Next.js 15 (App Router), Zustand, Tailwind CSS, shadcn/ui, lucide-react
- **Backend**: Next.js Route Handlers, Prisma (PostgreSQL)
- **Архитектура**: Feature-Sliced Design (FSD)
- **PWA**: Service Worker, Web Manifest

## Установка и запуск

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Настройка базы данных

Создайте PostgreSQL базу данных и обновите `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nails_service?schema=public"
JWT_SECRET="your-secret-key"
```

### 3. Применение миграций

```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
```

### 4. Заполнение тестовыми данными (опционально)

Откройте Prisma Studio и создайте мастера, услуги и доступности:

```bash
pnpm prisma studio
```

**Пример данных:**

1. **Создайте пользователя (Master)**:
   - role: `MASTER`
   - email: `master@example.com`
   - name: `Анна Иванова`

2. **Создайте услуги** (используйте ID мастера):
   - title: `Классический маникюр`
   - durationMin: `60`
   - priceCents: `150000` (1500 руб)
   - isActive: `true`

3. **Создайте доступности** (Availability):
   - date: `2025-10-16` (выберите будущую дату)
   - startMin: `540` (9:00 AM)
   - endMin: `1080` (6:00 PM)
   - isBlocked: `false`

### 5. Запуск в режиме разработки

```bash
pnpm dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

### 6. Сборка для продакшена

```bash
pnpm build
pnpm start
```

## Архитектура

Проект организован по методологии **Feature-Sliced Design (FSD)**:

```
├── app/                        # Next.js App Router
│   ├── api/                    # API Route Handlers
│   │   ├── auth/               # Авторизация (OTP)
│   │   ├── services/           # Услуги
│   │   ├── slots/              # Временные слоты
│   │   └── appointments/       # Записи
│   ├── (public)/               # Публичные страницы
│   │   └── m/[masterId]/       # Профиль мастера и бронирование
│   ├── auth/                   # Страницы авторизации
│   ├── dashboard/              # Кабинет мастера
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Главная страница
│   └── manifest.ts             # PWA manifest
├── src/
│   └── shared/                 # Общие ресурсы
│       ├── lib/                # Утилиты и хелперы
│       │   ├── prisma.ts       # Prisma client
│       │   ├── store.ts        # Zustand stores
│       │   ├── jwt.ts          # JWT утилиты
│       │   ├── calendar.ts     # Календарь (.ics, Google)
│       │   ├── slots.ts        # Генерация слотов
│       │   ├── utils.ts        # Общие утилиты
│       │   └── constants.ts    # Константы
│       └── ui/                 # UI компоненты
│           ├── button.tsx
│           ├── card.tsx
│           ├── input.tsx
│           └── loading.tsx
├── prisma/
│   └── schema.prisma           # Prisma схема
└── public/
    ├── sw.js                   # Service Worker
    └── offline.html            # Офлайн страница
```

## Основные маршруты

### Публичные страницы
- `/` - Главная страница (лендинг)
- `/m/[masterId]` - Профиль мастера с каталогом услуг
- `/m/[masterId]/book` - Страница бронирования
- `/auth` - Авторизация (запрос OTP)
- `/auth/verify` - Подтверждение OTP кода

### Кабинет мастера
- `/dashboard` - Главная панель мастера
- `/dashboard/services` - Управление услугами
- `/dashboard/schedule` - Управление расписанием

### API эндпоинты

**Авторизация:**
- `POST /api/auth/request-code` - Запрос OTP кода
- `POST /api/auth/verify-code` - Проверка OTP и создание сессии
- `GET /api/auth/me` - Получение текущего пользователя
- `POST /api/auth/logout` - Выход

**Услуги и слоты:**
- `GET /api/services?masterId=...` - Список услуг мастера
- `GET /api/slots?masterId=...&serviceId=...&date=YYYY-MM-DD` - Доступные слоты

**Записи:**
- `POST /api/appointments/create` - Создание записи
- `GET /api/appointments` - Список записей
- `GET /api/appointments/ics?id=...` - Скачать .ics файл

## Модель данных

### User
- `id`, `role` (MASTER | CLIENT), `phone`, `email`, `name`

### VerificationCode
- `id`, `target`, `code`, `expiresAt`, `used`

### Service
- `id`, `masterId`, `title`, `description`, `durationMin`, `priceCents`, `isActive`

### Availability
- `id`, `masterId`, `date`, `startMin`, `endMin`, `isBlocked`

### Appointment
- `id`, `masterId`, `clientId`, `serviceId`, `dateTime`, `durationMin`, `status`

## PWA

Приложение поддерживает установку как PWA:

1. **Manifest**: `/app/manifest.ts`
2. **Service Worker**: `/public/sw.js` (cache-first стратегия)
3. **Офлайн страница**: `/public/offline.html`

### Установка PWA

- **iOS Safari**: Поделиться → Добавить на главный экран
- **Android Chrome**: Меню → Установить приложение
- **Desktop Chrome**: Кнопка установки в адресной строке

## Календарь

### Добавление в календарь

После создания записи доступны две опции:

1. **Скачать .ics файл** - работает на iOS, macOS, Outlook
2. **Открыть в Google Calendar** - универсальная веб-ссылка

Формат даты для Google Calendar: `YYYYMMDDTHHMMSSZ` (без дефисов/двоеточий)

## Авторизация (OTP)

- Код из 6 цифр
- TTL: 10 минут
- В development коды выводятся в консоль сервера
- Rate limit: 3 запроса в минуту с одного IP

## Безопасность

- JWT-токены с httpOnly cookies
- Транзакции при создании записей (защита от конфликтов)
- Время хранится в UTC, отображается в локальной зоне
- Валидация всех входящих данных

## Разработка

### Команды

```bash
# Разработка
pnpm dev

# Сборка
pnpm build

# Prisma
pnpm prisma studio          # Открыть UI для БД
pnpm prisma migrate dev     # Применить миграции
pnpm prisma generate        # Генерация клиента

# Линтер
pnpm lint
```

### Добавление новых компонентов

Следуйте FSD архитектуре:

- **shared/ui/** - переиспользуемые UI компоненты
- **shared/lib/** - утилиты и хелперы
- **entities/** - бизнес-сущности (user, service, appointment)
- **features/** - фичи (auth-otp, book-appointment)
- **widgets/** - композитные блоки
- **app/** - страницы и роуты

## Production Deployment

1. Настройте PostgreSQL базу данных
2. Установите переменные окружения:
   - `DATABASE_URL`
   - `JWT_SECRET` (используйте `openssl rand -base64 32`)
   - `NODE_ENV=production`
3. Запустите миграции: `pnpm prisma migrate deploy`
4. Соберите приложение: `pnpm build`
5. Запустите: `pnpm start`

### Рекомендуемые хостинги

- **Vercel** - простой деплой Next.js + Neon/Supabase для PostgreSQL
- **Render** - Web Service + PostgreSQL Database
- **Fly.io** - полный контроль над инфраструктурой

## Roadmap после MVP

- [ ] Web Push уведомления за 24ч/2ч до записи
- [ ] Webcal подписка на календарь мастера/клиента
- [ ] Отмена/перенос записи
- [ ] Онлайн-оплата
- [ ] SMS/Email интеграции (Twilio, SendGrid)
- [ ] Отзывы и рейтинги
- [ ] Аналитика для мастера
- [ ] Multi-tenant (несколько мастеров)

## Лицензия

MIT

## Поддержка

Для вопросов и предложений создавайте issue в репозитории.
