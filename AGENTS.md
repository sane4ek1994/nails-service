# AGENTS.md — Модель работы агентов и правила проекта «Маникюр PWA»

## 1) Видение
Веб-PWA для мастера маникюра и его клиентов. Клиенты видят услуги и свободные слоты, создают запись, получают напоминания и добавляют событие в календарь (iOS/Android). Мастер управляет расписанием, услугами и записями.

## 2) Область (MVP)
- Регистрация/вход по телефону **или** email (OTP, 6 цифр, TTL 10 минут).
- Страницы: публичная витрина мастера, выбор услуги → слота → подтверждение.
- Создание записи (защита от конфликтов).
- Кнопки “Добавить в календарь (.ics)” и “Открыть в Google Calendar”.
- PWA: manifest, сервис-воркер для кеширования статики и публичных GET.
- Кабинет мастера (минимум): услуги, расписание, список записей.

## 3) Технологии
- Frontend: TypeScript, Next.js (App Router), FSD, Zustand, Tailwind, shadcn/ui, lucide-react.
- Backend: Next.js Route Handlers, Prisma (PostgreSQL).
- Хранение времени: UTC в БД; отображение в локальной TZ клиента/мастера.

## 4) Не-цели MVP
- Онлайн-оплаты, сложная CRM, интеграция с внешними SMS/e-mail провайдерами (кроме базового OTP-скелета).
- Сложная аналитика, роли ADMIN сверх MASTER/CLIENT.

## 5) Архитектура (кратко)
app/ # App Router (маршруты + API)
(public)/ # лендинг/публичные страницы
auth/ # /auth, /auth/verify
m/[masterId]/ # /m/:masterId
m/[masterId]/book/ # /m/:masterId/book
dashboard/ # кабинет мастера
api/ # route handlers:
auth/
request-code/route.ts
verify-code/route.ts
services/route.ts
slots/route.ts
appointments/
create/route.ts
ics/route.ts
shared/ # api/ lib/ ui/ store/
entities/ # user, service, appointment
features/ # auth-otp, book-appointment, add-to-calendar
widgets/ # calendars, lists
processes/ # сквозные процессы (опц.)

## 6) Модель данных (Prisma, минимальная)
- `User { id, role: MASTER|CLIENT, phone?, email?, name }`
- `VerificationCode { target, code, expiresAt, used }`
- `Service { masterId, title, durationMin, priceCents, isActive }`
- `Availability { masterId, date, startMin, endMin, isBlocked }`
- `Appointment { masterId, clientId, serviceId, date(UTC), durationMin, status }`

## 7) Основные эндпоинты
- `POST /api/auth/request-code` → создать VerificationCode (TTL 10 мин).
- `POST /api/auth/verify-code` → валидация кода, создать/найти User, cookie `session`.
- `GET /api/services?masterId=...` → список активных услуг мастера.
- `GET /api/slots?masterId=...&serviceId=...&date=YYYY-MM-DD` → свободные слоты.
- `POST /api/appointments/create` → запись с проверкой конфликтов.
- `GET /api/appointments/ics?id=...` → `text/calendar` (.ics) для события.

## 8) Календарь (iOS/Android)
- .ics: `Content-Type: text/calendar; charset=utf-8`, `Content-Disposition: attachment`.
- Google Calendar link:
https://calendar.google.com/calendar/r/eventedit
?
action=TEMPLATE&text=<title>
&dates=<YYYYMMDDTHHMMSSZ>/<YYYYMMDDTHHMMSSZ>
&details=<desc>&location=<location>


## 9) PWA
- `app/manifest.ts` с name/short_name/icons/theme_color.
- `public/sw.js` кеширует статику и публичные GET (простая стратегия).
- Регистрация SW в `app/layout.tsx` (клиентский эффект).

## 10) Правила кодирования
- TypeScript strict, никаких `any`.
- ФСD: shared → entities → features → widgets → pages/processes.
- Серверная валидация входящих данных (минимум zod/ручные проверки).
- Время: хранить в UTC, форматировать на клиенте.

## 11) Роли агентов и чек-листы

### Agent: Архитектор
- Уточняет границы MVP, подтверждает маршруты и схему БД.
- Проверяет соответствие FSD и App Router.
- DoD: схема мигрирует; маршруты регистрируются без 404; сборка проходит.

### Agent: Бэкенд (Prisma/API)
- Пишет схемы, миграции, Prisma client.
- Реализует эндпоинты (auth, services, slots, create appointment, ics).
- Транзакции и проверка пересечений слотов.
- DoD: e2e ручная проверка создания записи без конфликтов.

### Agent: Фронтенд (UI/FSD/Zustand)
- Страницы `/m/:masterId`, `/m/:masterId/book`, `/auth`, `/auth/verify`, `/dashboard`.
- Виджеты: каталог услуг, грид слотов, подтверждение записи, кнопки календаря.
- DoD: визит создаётся, .ics скачивается, Google link открывается.

### Agent: Авторизация (OTP)
- `request-code` + `verify-code`, httpOnly cookie `session`.
- Rate limit на `request-code` (минимальный).
- DoD: вход по телефону/email работает; TTL кодов соблюдается.

### Agent: PWA/Офлайн
- `manifest.ts`, `sw.js`, регистрация, офлайн-страница/кеш статики.
- DoD: приложение устанавливается; при offline видны кэшированные ресурсы.

### Agent: Календарь/Время
- Генерация `.ics` (UID, DTSTART/DTEND, SUMMARY, DESCRIPTION, LOCATION).
- Правильное формирование `dates` для Google.
- DoD: iOS открывает .ics, Android/Chrome открывает Google Calendar.

### Agent: QA
- Чек-лист сценариев: вход → выбор услуги → слот → запись → .ics → Google.
- Негативные кейсы: просроченный OTP, двойное бронирование, пустой каталог.
- DoD: все тест-кейсы пройдены вручную.

## 12) Опасные точки и меры
- Дублирующие записи → транзакции и проверка пересечений.
- Временные зоны → хранить UTC; на клиенте — локальная TZ.
- Защита OTP → TTL, флаг `used`, rate limit по IP/target.

## 13) Definition of Done (MVP)
- Все эндпоинты работают и покрывают сценарий брони.
- PWA установимо; офлайн базово работает.
- .ics и Google Calendar — проверены на реальных устройствах (iOS/Android).
- Деплой на любой хостинг с PostgreSQL (Render/Fly/домашний сервер).

## 14) Дорожная карта после MVP
- Web Push напоминания за 24ч/2ч.
- Webcal фиды (подписка календаря мастера/клиента).
- Импорт/экспорт клиентов, аналитика, no-show отслеживание.
