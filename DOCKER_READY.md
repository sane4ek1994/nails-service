# ✅ PostgreSQL в Docker готов к работе!

## 🎉 Что сделано:

1. ✅ **PostgreSQL запущен** в Docker контейнере `nails-service-db`
2. ✅ **База данных создана** и настроена
3. ✅ **Миграции применены** (все таблицы созданы)
4. ✅ **Тестовые данные добавлены**

---

## 📦 Что в базе данных:

### Мастер
- **Email**: `master@example.com`
- **Имя**: Анна Иванова
- **ID**: `cmgsdjp570000p8c8vc6umihm`
- **Роль**: MASTER

### Клиент
- **Email**: `client@example.com`
- **Имя**: Мария Петрова
- **Роль**: CLIENT

### Услуги (3 шт)
1. **Классический маникюр** - 60 мин, 1500₽
2. **Аппаратный маникюр** - 90 мин, 2000₽
3. **Педикюр** - 75 мин, 1800₽

### Расписание
- **7 дней** вперед (пн-сб)
- **Время**: 9:00 - 18:00
- **Шаг слотов**: 15 минут

---

## 🚀 Как открыть приложение:

### 1. Откройте главную страницу
```
http://localhost:3000
```

### 2. Откройте профиль мастера
```
http://localhost:3000/m/cmgsdjp570000p8c8vc6umihm
```
> Здесь вы увидите 3 услуги и сможете записаться!

### 3. Войдите как мастер
1. Перейдите на http://localhost:3000/auth
2. Введите `master@example.com`
3. **Код появится в консоли сервера** (терминал где запущен `pnpm dev`)
4. Введите код → попадёте в `/dashboard`

---

## 🧪 Как протестировать бронирование:

1. Откройте профиль мастера: http://localhost:3000/m/cmgsdjp570000p8c8vc6umihm
2. Нажмите **"Записаться"** на любой услуге
3. Выберите **сегодняшнюю дату** или завтра
4. Выберите **время** (например, 10:00)
5. Нажмите **"Подтвердить запись"**
6. Вы увидите экран успеха с кнопками:
   - **"Скачать .ics"** → откроется в Calendar (iOS/macOS)
   - **"Открыть в Google Calendar"** → откроется веб-календарь

---

## 🛠️ Полезные команды:

### Docker PostgreSQL

```bash
# Проверить статус
docker ps

# Остановить
docker-compose down

# Запустить снова
docker-compose up -d

# Посмотреть логи
docker-compose logs -f postgres

# Подключиться к PostgreSQL
docker exec -it nails-service-db psql -U nails_user -d nails_service
```

### Prisma

```bash
# Открыть GUI для БД
pnpm prisma studio
# → http://localhost:5555

# Сбросить БД и заполнить заново
pnpm prisma migrate reset

# Применить миграции
pnpm prisma migrate dev

# Заполнить тестовыми данными
pnpm prisma db seed
```

### Приложение

```bash
# Запустить dev сервер
pnpm dev

# Собрать для production
pnpm build

# Запустить production
pnpm start
```

---

## 📊 Просмотр данных через Prisma Studio

```bash
pnpm prisma studio
```

Откроется: **http://localhost:5555**

Вы сможете:
- Просматривать все таблицы
- Редактировать записи
- Добавлять новые данные
- Удалять записи

---

## 🔍 Как найти ID мастера:

### Способ 1: Prisma Studio (рекомендуется)
```bash
pnpm prisma studio
```
1. Откройте таблицу `User`
2. Найдите мастера (role: `MASTER`)
3. Скопируйте `id`

### Способ 2: Через psql
```bash
docker exec -it nails-service-db psql -U nails_user -d nails_service -c "SELECT id, name, email FROM \"User\" WHERE role='MASTER';"
```

---

## 📝 Структура подключения:

```env
# Файл .env (уже настроен)
DATABASE_URL="postgresql://nails_user:nails_password@localhost:5432/nails_service?schema=public"
JWT_SECRET="development-secret-key-change-in-production"
NODE_ENV="development"
```

| Параметр | Значение |
|----------|----------|
| Хост | localhost |
| Порт | 5432 |
| Пользователь | nails_user |
| Пароль | nails_password |
| База данных | nails_service |

---

## ⚠️ Важно знать:

### OTP коды в development
В режиме разработки коды **выводятся в консоль сервера**.

После ввода email на странице `/auth`, смотрите в терминал:
```
[OTP] Code for master@example.com: 123456 (expires at ...)
```

### Время работы слотов
По умолчанию: **9:00 - 18:00**

Чтобы изменить:
1. Откройте Prisma Studio
2. Перейдите в таблицу `Availability`
3. Измените `startMin` и `endMin`:
   - `startMin: 540` = 9:00 (9 × 60)
   - `endMin: 1080` = 18:00 (18 × 60)

### Добавить своего мастера
1. Откройте Prisma Studio: `pnpm prisma studio`
2. Перейдите в таблицу `User`
3. Нажмите **"Add record"**
4. Заполните:
   - role: `MASTER`
   - email: ваш email
   - name: ваше имя
5. Создайте услуги через таблицу `Service`
6. Создайте расписание через таблицу `Availability`

---

## 🎯 Что дальше?

1. ✅ Протестируйте все функции
2. ✅ Попробуйте создать запись
3. ✅ Проверьте .ics и Google Calendar
4. ✅ Войдите в кабинет мастера
5. ✅ Изучите код и архитектуру

---

## 📚 Полная документация:

- [START_HERE.md](./START_HERE.md) - Начало работы
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Подробно про Docker
- [README.md](./README.md) - Полная документация
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Что реализовано

---

## 🆘 Проблемы?

### Сервер не запускается
```bash
# Проверьте что PostgreSQL запущен
docker ps

# Если нет, запустите
docker-compose up -d
```

### Порт 3000 занят
```bash
# Запустите на другом порту
PORT=3001 pnpm dev
```

### Ошибки в БД
```bash
# Пересоздайте БД
pnpm prisma migrate reset
```

---

## ✨ Готово!

**Приложение работает!** 🎉

Откройте: http://localhost:3000

**Удачи!** 🚀

