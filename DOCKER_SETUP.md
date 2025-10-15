# 🐳 Настройка PostgreSQL через Docker

Пошаговая инструкция для запуска PostgreSQL в Docker Desktop.

## Предварительные требования

- ✅ Docker Desktop установлен и запущен
- ✅ Node.js 18+ установлен
- ✅ pnpm установлен (или npm/yarn)

## 🚀 Быстрый старт (3 шага)

### Шаг 1: Запустите PostgreSQL в Docker

Откройте терминал в корне проекта и выполните:

```bash
docker-compose up -d
```

**Что происходит:**
- Скачивается образ PostgreSQL 16 (Alpine - легкая версия)
- Создается контейнер `nails-service-db`
- База данных доступна на `localhost:5432`
- Данные сохраняются в Docker volume `postgres_data`

**Проверка:**
```bash
docker ps
```

Вы должны увидеть запущенный контейнер `nails-service-db`.

### Шаг 2: Установите зависимости проекта

```bash
pnpm install
```

### Шаг 3: Настройте базу данных

```bash
# Применить миграции Prisma
pnpm prisma migrate dev --name init

# Сгенерировать Prisma Client
pnpm prisma generate

# Заполнить тестовыми данными (опционально)
pnpm prisma db seed
```

**Или все вместе:**
```bash
pnpm prisma migrate dev --name init && pnpm prisma generate && pnpm prisma db seed
```

### Шаг 4: Запустите приложение

```bash
pnpm dev
```

Откройте: **http://localhost:3000** 🎉

---

## 📋 Полезные команды Docker

### Управление контейнером

```bash
# Запустить PostgreSQL
docker-compose up -d

# Остановить PostgreSQL
docker-compose down

# Остановить и удалить данные
docker-compose down -v

# Посмотреть логи
docker-compose logs -f postgres

# Перезапустить
docker-compose restart
```

### Подключение к PostgreSQL

```bash
# Через docker exec (psql клиент)
docker exec -it nails-service-db psql -U nails_user -d nails_service

# Внутри psql:
\dt          # Показать таблицы
\d User      # Описание таблицы User
\q           # Выйти
```

### Проверка состояния

```bash
# Статус контейнера
docker ps

# Детальная информация
docker inspect nails-service-db

# Использование ресурсов
docker stats nails-service-db
```

---

## 🔧 Настройки подключения

### Параметры из docker-compose.yml

| Параметр | Значение |
|----------|----------|
| **Хост** | `localhost` |
| **Порт** | `5432` |
| **Пользователь** | `nails_user` |
| **Пароль** | `nails_password` |
| **База данных** | `nails_service` |

### DATABASE_URL в .env

```env
DATABASE_URL="postgresql://nails_user:nails_password@localhost:5432/nails_service?schema=public"
```

### Изменение параметров

Отредактируйте `docker-compose.yml`:

```yaml
environment:
  POSTGRES_USER: your_username      # Ваш пользователь
  POSTGRES_PASSWORD: your_password  # Ваш пароль
  POSTGRES_DB: your_database        # Имя БД
```

**После изменений:**
```bash
docker-compose down
docker-compose up -d
```

---

## 🗄️ Управление данными

### Сброс базы данных

```bash
# Способ 1: Через Prisma (рекомендуется)
pnpm prisma migrate reset

# Способ 2: Пересоздать контейнер
docker-compose down -v
docker-compose up -d
pnpm prisma migrate dev --name init
pnpm prisma generate
pnpm prisma db seed
```

### Backup базы данных

```bash
# Создать backup
docker exec nails-service-db pg_dump -U nails_user nails_service > backup.sql

# Восстановить из backup
docker exec -i nails-service-db psql -U nails_user -d nails_service < backup.sql
```

### Просмотр данных через Prisma Studio

```bash
pnpm prisma studio
```

Откроется GUI: **http://localhost:5555**

---

## ⚠️ Решение проблем

### Проблема: Порт 5432 занят

**Причина:** PostgreSQL уже запущен локально

**Решение 1:** Остановите локальный PostgreSQL
```bash
# Windows (в PowerShell как администратор)
Stop-Service postgresql-x64-14  # или другая версия

# Linux/Mac
sudo systemctl stop postgresql
```

**Решение 2:** Измените порт в docker-compose.yml
```yaml
ports:
  - "5433:5432"  # Внешний порт 5433 вместо 5432
```

И обновите .env:
```env
DATABASE_URL="postgresql://nails_user:nails_password@localhost:5433/nails_service?schema=public"
```

### Проблема: Docker не запускается

**Решение:**
1. Убедитесь что Docker Desktop запущен
2. Проверьте: Settings → Resources → Advanced → Memory (минимум 2GB)
3. Перезапустите Docker Desktop

### Проблема: Ошибка при миграции

```
Error: P1001: Can't reach database server
```

**Решение:**
```bash
# Проверьте что контейнер запущен
docker ps

# Проверьте логи
docker-compose logs postgres

# Подождите 10-15 секунд после запуска контейнера
# Затем попробуйте миграцию снова
pnpm prisma migrate dev
```

### Проблема: "relation does not exist"

**Решение:**
```bash
# Пересоздайте миграции
pnpm prisma migrate reset
pnpm prisma migrate dev --name init
```

---

## 🎯 Рекомендации для разработки

### 1. Автозапуск при старте компьютера

В `docker-compose.yml` уже настроено:
```yaml
restart: unless-stopped
```

Docker автоматически запустит контейнер при старте Docker Desktop.

### 2. Мониторинг в Docker Desktop

1. Откройте Docker Desktop
2. Перейдите в Containers
3. Найдите `nails-service-db`
4. Можно посмотреть:
   - Логи
   - Статистику (CPU, Memory)
   - Инспектировать

### 3. Разные окружения

**Development (Docker):**
```env
DATABASE_URL="postgresql://nails_user:nails_password@localhost:5432/nails_service?schema=public"
```

**Production (например, Neon/Supabase):**
```env
DATABASE_URL="postgresql://user:pass@host.region.provider.com:5432/dbname?sslmode=require"
```

---

## 📊 Структура данных после seed

После выполнения `pnpm prisma db seed` в БД будет:

**Users:**
- Мастер: `master@example.com`
- Клиент: `client@example.com`

**Services (3 штуки):**
- Классический маникюр (60 мин, 1500₽)
- Аппаратный маникюр (90 мин, 2000₽)
- Педикюр (75 мин, 1800₽)

**Availability:**
- 7 дней вперед
- Понедельник-Суббота
- 9:00 - 18:00

---

## 🔄 Полный цикл работы

```bash
# 1. Запуск PostgreSQL
docker-compose up -d

# 2. Установка зависимостей
pnpm install

# 3. Настройка БД
pnpm prisma migrate dev --name init
pnpm prisma generate
pnpm prisma db seed

# 4. Запуск приложения
pnpm dev

# 5. Работа с данными
pnpm prisma studio

# 6. Когда закончили
docker-compose down  # Или оставьте работать
```

---

## ✨ Готово!

PostgreSQL запущен в Docker и готов к использованию! 🎉

**Следующий шаг:** Вернитесь к [START_HERE.md](./START_HERE.md) и продолжите настройку проекта.

