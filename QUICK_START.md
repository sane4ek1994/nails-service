# 🚀 Быстрый старт

Инструкция для быстрого запуска MVP "Маникюр PWA".

## Предварительные требования

- Node.js 18+
- PostgreSQL 14+
- pnpm (или npm/yarn)

## Установка за 5 шагов

### 1. Клонирование и установка зависимостей

```bash
git clone <repository-url>
cd nails-service
pnpm install
```

### 2. Настройка базы данных

Создайте PostgreSQL базу данных и скопируйте `.env.example` в `.env`:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Отредактируйте `.env` и укажите DATABASE_URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nails_service?schema=public"
JWT_SECRET="your-random-secret-key-here"
NODE_ENV="development"
```

### 3. Применение миграций и заполнение данными

```bash
# Применить миграции
pnpm prisma migrate dev --name init

# Сгенерировать Prisma Client
pnpm prisma generate

# Заполнить тестовыми данными (опционально)
pnpm prisma:seed
```

После выполнения seed скрипта будут созданы:
- **Мастер**: master@example.com
- **Клиент**: client@example.com
- **3 услуги** (маникюр, аппаратный, педикюр)
- **Расписание** на следующие 7 дней (9:00-18:00, кроме воскресенья)

### 4. Запуск в режиме разработки

```bash
pnpm dev
```

Приложение будет доступно по адресу: **http://localhost:3000**

### 5. Открытие Prisma Studio (опционально)

Для просмотра и редактирования данных:

```bash
pnpm prisma:studio
```

Откроется GUI по адресу: **http://localhost:5555**

## Тестирование функционала

### Авторизация (OTP)

1. Перейдите на `/auth`
2. Введите любой email или телефон
3. В консоли сервера (терминал с `pnpm dev`) появится 6-значный код
4. Введите код на странице `/auth/verify`

> **Примечание**: В development коды выводятся в консоль. В production настройте SMS/Email провайдер.

### Просмотр услуг мастера

Получите ID мастера из Prisma Studio или из seed данных, затем:

```
http://localhost:3000/m/{masterId}
```

Например, если ID мастера `cm4abcd1234`, откройте:
```
http://localhost:3000/m/cm4abcd1234
```

### Создание записи

1. На странице мастера нажмите "Записаться" на любой услуге
2. Выберите дату и время
3. Подтвердите запись
4. Скачайте .ics или откройте Google Calendar

### Кабинет мастера

Войдите как мастер (master@example.com) и перейдите в `/dashboard`

## Структура проекта

```
├── app/                    # Next.js App Router
│   ├── api/                # API эндпоинты
│   ├── auth/               # Страницы авторизации
│   ├── dashboard/          # Кабинет мастера
│   ├── (public)/m/         # Публичные страницы
│   └── manifest.ts         # PWA manifest
├── src/shared/             # FSD: shared слой
│   ├── lib/                # Утилиты и логика
│   └── ui/                 # UI компоненты
├── prisma/
│   ├── schema.prisma       # Prisma схема
│   └── seed.ts             # Seed данные
└── public/
    ├── sw.js               # Service Worker
    └── offline.html        # Офлайн страница
```

## Основные команды

```bash
# Разработка
pnpm dev                    # Запуск dev сервера
pnpm build                  # Сборка для production
pnpm start                  # Запуск production сервера

# База данных
pnpm prisma:generate        # Генерация Prisma Client
pnpm prisma:migrate         # Применение миграций
pnpm prisma:studio          # Открыть Prisma Studio
pnpm prisma:seed            # Заполнение тестовыми данными
pnpm db:setup               # Всё вместе: migrate + generate + seed

# Линтинг
pnpm lint                   # Проверка кода
```

## API эндпоинты

### Авторизация
- `POST /api/auth/request-code` - Запрос OTP
- `POST /api/auth/verify-code` - Проверка OTP
- `GET /api/auth/me` - Текущий пользователь
- `POST /api/auth/logout` - Выход

### Услуги и слоты
- `GET /api/services?masterId={id}` - Услуги мастера
- `GET /api/slots?masterId={id}&serviceId={id}&date=YYYY-MM-DD` - Слоты

### Записи
- `POST /api/appointments/create` - Создание записи
- `GET /api/appointments` - Список записей
- `GET /api/appointments/ics?id={id}` - Скачать .ics

## PWA

Приложение поддерживает установку как PWA:

### Установка на устройство

- **iOS**: Safari → Поделиться → "Добавить на главный экран"
- **Android**: Chrome → Меню → "Установить приложение"
- **Desktop**: Chrome → иконка установки в адресной строке

### Офлайн режим

Service Worker кеширует статику и изображения. При отсутствии интернета показывается `/offline.html`.

## Решение проблем

### Ошибка подключения к БД

```
Error: Can't reach database server
```

**Решение**: Убедитесь что PostgreSQL запущен и DATABASE_URL в `.env` правильный.

### Prisma Client не найден

```
Error: Cannot find module '@prisma/client'
```

**Решение**: 
```bash
pnpm prisma generate
```

### Ошибки при миграции

```
Error: P3009 Failed to migrate
```

**Решение**: Сбросьте базу и примените миграции заново:
```bash
pnpm prisma migrate reset
pnpm db:setup
```

### Port 3000 занят

**Решение**: Измените порт:
```bash
PORT=3001 pnpm dev
```

## Следующие шаги

1. ✅ Настройте production DATABASE_URL
2. ✅ Сгенерируйте JWT_SECRET (`openssl rand -base64 32`)
3. ✅ Создайте настоящие PNG иконки для PWA (192x192, 512x512)
4. ✅ Настройте SMS/Email провайдер для OTP
5. ✅ Деплойте на Vercel/Render/Fly.io

## Документация

- [README.md](./README.md) - Полная документация
- [AGENTS.md](./AGENTS.md) - Спецификация и правила проекта
- [FSD Structure](./src/shared/docs/FSD-STRUCTURE.md) - Архитектура

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера (F12)
2. Проверьте логи сервера (терминал с `pnpm dev`)
3. Откройте issue в репозитории

