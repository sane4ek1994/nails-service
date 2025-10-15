# 🔗 Быстрые ссылки

## 🌐 Приложение

| Страница | URL |
|----------|-----|
| **Главная** | http://localhost:3000 |
| **Профиль мастера** | http://localhost:3000/m/cmgsdjp570000p8c8vc6umihm |
| **Авторизация** | http://localhost:3000/auth |
| **Кабинет мастера** | http://localhost:3000/dashboard |

## 🛠️ Инструменты

| Инструмент | URL |
|------------|-----|
| **Prisma Studio** (БД GUI) | http://localhost:5555 |
| **Docker Desktop** | Откройте приложение → Containers → `nails-service-db` |

## 👤 Тестовые данные

### Мастер
- **Email**: `master@example.com`
- **ID**: `cmgsdjp570000p8c8vc6umihm`

### Клиент  
- **Email**: `client@example.com`

## 📋 Основные команды

```bash
# Docker
docker-compose up -d        # Запустить PostgreSQL
docker-compose down         # Остановить
docker ps                   # Статус

# База данных
pnpm prisma studio          # GUI для БД
pnpm prisma migrate reset   # Сброс БД

# Приложение
pnpm dev                    # Запуск dev сервера
```

## 📖 Документация

- **[DOCKER_READY.md](./DOCKER_READY.md)** ← НАЧНИТЕ ЗДЕСЬ
- [START_HERE.md](./START_HERE.md)
- [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- [README.md](./README.md)

