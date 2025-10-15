# 🎯 НАЧНИТЕ ЗДЕСЬ - Запуск MVP "Маникюр PWA"

## ⚡ Быстрый старт (5 минут)

### Шаг 1: Установите зависимости

```bash
pnpm install
```

### Шаг 2: Настройте базу данных

Создайте файл `.env` в корне проекта:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nails_service?schema=public"
JWT_SECRET="development-secret-change-in-production"
NODE_ENV="development"
```

> **Важно**: Замените `user`, `password` на ваши PostgreSQL credentials

### Шаг 3: Настройка базы данных

```bash
# Применить миграции + сгенерировать Prisma Client + заполнить тестовыми данными
pnpm db:setup
```

Эта команда:
- Создаст таблицы в БД
- Сгенерирует Prisma Client
- Создаст мастера (master@example.com)
- Создаст 3 услуги
- Создаст расписание на 7 дней

### Шаг 4: Запустите проект

```bash
pnpm dev
```

Откройте: **http://localhost:3000**

---

## 🧪 Тестирование

### 1. Авторизация

1. Откройте http://localhost:3000/auth
2. Введите любой email (например: `test@example.com`)
3. **Код появится в консоли сервера** (терминал где запущен `pnpm dev`)
4. Введите код на странице подтверждения

### 2. Просмотр услуг мастера

Сначала получите ID мастера:

```bash
pnpm prisma:studio
```

Откроется http://localhost:5555

- Перейдите в таблицу `User`
- Найдите мастера (role: MASTER)
- Скопируйте его `id` (например: `cm4abc123def456`)

Откройте в браузере:
```
http://localhost:3000/m/{скопированный_id}
```

### 3. Создание записи

1. На странице мастера нажмите "Записаться" на любой услуге
2. Выберите дату (сегодня или завтра)
3. Выберите время из доступных слотов
4. Подтвердите запись
5. После создания:
   - Нажмите "Скачать .ics файл" → откроется в Calendar
   - Нажмите "Открыть в Google Calendar" → откроется веб-календарь

### 4. Кабинет мастера

Войдите как мастер:
1. `/auth` → введите `master@example.com`
2. Введите код из консоли
3. Автоматически перенаправит в `/dashboard`

---

## 📁 Структура проекта

```
nails-service/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   │   ├── auth/           # Авторизация (OTP)
│   │   ├── services/       # Услуги
│   │   ├── slots/          # Временные слоты
│   │   └── appointments/   # Записи
│   ├── (public)/m/         # Публичные страницы мастеров
│   ├── auth/               # Страницы авторизации
│   ├── dashboard/          # Кабинет мастера
│   └── manifest.ts         # PWA Manifest
│
├── src/shared/             # FSD: Shared слой
│   ├── lib/                # Утилиты и бизнес-логика
│   │   ├── prisma.ts       # Prisma Client
│   │   ├── store.ts        # Zustand stores
│   │   ├── jwt.ts          # JWT утилиты
│   │   ├── calendar.ts     # .ics и Google Calendar
│   │   ├── slots.ts        # Генерация слотов
│   │   └── utils.ts        # Общие утилиты
│   └── ui/                 # UI компоненты
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── loading.tsx
│
├── prisma/
│   ├── schema.prisma       # Схема БД
│   └── seed.ts             # Тестовые данные
│
├── public/
│   ├── sw.js               # Service Worker
│   ├── offline.html        # Офлайн страница
│   └── icon-*.png          # PWA иконки
│
├── README.md               # Полная документация
├── QUICK_START.md          # Быстрый старт
├── IMPLEMENTATION.md       # Отчёт о реализации
└── AGENTS.md               # Исходная спецификация
```

---

## 🔧 Полезные команды

```bash
# Разработка
pnpm dev                    # Запуск dev сервера
pnpm build                  # Сборка для production
pnpm start                  # Запуск production сервера

# База данных
pnpm prisma:studio          # GUI для БД (http://localhost:5555)
pnpm prisma:generate        # Генерация Prisma Client
pnpm prisma:migrate         # Применить миграции
pnpm prisma:seed            # Заполнить тестовыми данными
pnpm db:setup               # Всё вместе (migrate + generate + seed)

# Проверка кода
pnpm lint                   # ESLint
```

---

## 📚 Документация

| Файл | Описание |
|------|----------|
| [README.md](./README.md) | Полная документация проекта |
| [QUICK_START.md](./QUICK_START.md) | Подробный быстрый старт |
| [IMPLEMENTATION.md](./IMPLEMENTATION.md) | Что реализовано |
| [AGENTS.md](./AGENTS.md) | Исходная спецификация |
| [FSD-STRUCTURE.md](./src/shared/docs/FSD-STRUCTURE.md) | Архитектура |

---

## 🌐 Основные URL

| URL | Описание |
|-----|----------|
| http://localhost:3000 | Главная страница |
| http://localhost:3000/auth | Авторизация |
| http://localhost:3000/m/{masterId} | Профиль мастера |
| http://localhost:3000/dashboard | Кабинет мастера |
| http://localhost:5555 | Prisma Studio (БД) |

---

## 🎯 API Endpoints

### Авторизация
- `POST /api/auth/request-code` - Запрос OTP
- `POST /api/auth/verify-code` - Проверка OTP
- `GET /api/auth/me` - Текущий пользователь
- `POST /api/auth/logout` - Выход

### Услуги и слоты
- `GET /api/services?masterId={id}` - Услуги мастера
- `GET /api/slots?masterId={id}&serviceId={id}&date=YYYY-MM-DD` - Слоты

### Записи
- `POST /api/appointments/create` - Создать запись
- `GET /api/appointments` - Список записей
- `GET /api/appointments/ics?id={id}` - Скачать .ics

---

## ⚠️ Решение проблем

### Ошибка подключения к БД

```
Can't reach database server at `localhost:5432`
```

**Решение:**
1. Проверьте что PostgreSQL запущен
2. Проверьте DATABASE_URL в `.env`
3. Создайте базу данных: `createdb nails_service`

### Prisma Client не найден

```
Cannot find module '@prisma/client'
```

**Решение:**
```bash
pnpm prisma generate
```

### Port 3000 занят

```bash
PORT=3001 pnpm dev
```

---

## 🚀 Что дальше?

1. ✅ **Протестируйте все функции** (авторизация, бронирование, календарь)
2. ✅ **Добавьте своего мастера** через Prisma Studio
3. ✅ **Настройте production БД** для деплоя
4. ✅ **Создайте PNG иконки** для PWA (192x192, 512x512)
5. ✅ **Интегрируйте SMS/Email** для отправки OTP

---

## 💡 Советы

- **Development**: Коды OTP выводятся в консоль сервера
- **Prisma Studio**: Лучший способ управлять данными в development
- **PWA**: Протестируйте установку на телефон
- **Календарь**: Проверьте .ics на iPhone, Google Calendar на Android

---

## 📞 Поддержка

Если что-то не работает:
1. Проверьте консоль браузера (F12)
2. Проверьте логи сервера (терминал)
3. Проверьте [QUICK_START.md](./QUICK_START.md)
4. Создайте issue в репозитории

---

## ✨ Готово!

Проект готов к работе. Следуйте инструкциям выше и наслаждайтесь! 🎉

**Удачи!** 🚀

