# Feature-Sliced Design Structure

This project follows the FSD (Feature-Sliced Design) methodology for organizing code.

## Directory Structure

```
src/
├── shared/           # Shared resources used across the app
│   ├── lib/          # Utilities, helpers, configurations
│   │   ├── prisma.ts       # Prisma client singleton
│   │   ├── store.ts        # Zustand global stores
│   │   ├── jwt.ts          # JWT utilities
│   │   ├── calendar.ts     # Calendar utilities (.ics, Google)
│   │   ├── slots.ts        # Slot generation logic
│   │   ├── utils.ts        # Common utilities
│   │   └── constants.ts    # App-wide constants
│   └── ui/           # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── loading.tsx
│       └── sw-register.tsx
│
├── entities/         # Business entities (future)
│   ├── user/
│   ├── service/
│   └── appointment/
│
├── features/         # Features/use cases (future)
│   ├── auth-otp/
│   ├── book-appointment/
│   └── manage-schedule/
│
└── widgets/          # Composite blocks (future)
    ├── service-catalog/
    ├── slot-picker/
    └── appointment-list/
```

## Layers (from bottom to top)

1. **shared** - Reusable code: UI kit, utils, API clients
2. **entities** - Business entities: user, service, appointment
3. **features** - User interactions: auth, booking, calendar
4. **widgets** - Compositional layer: combines entities and features
5. **pages** - Application pages (in app/ directory)
6. **app** - App initialization, routing, global providers

## Current State

For MVP, most code is in `shared/` and `app/`. As the project grows, extract:

- User-related logic → `entities/user/`
- Booking flow → `features/book-appointment/`
- Service catalog UI → `widgets/service-catalog/`

## Import Rules

- Lower layers can't import from upper layers
- Shared can't import from entities/features/widgets
- Entities can import from shared only
- Features can import from shared and entities
- Widgets can import from shared, entities, and features

## Benefits

- Clear boundaries between modules
- Easy to understand file locations
- Scalable architecture
- Prevents circular dependencies
- Team-friendly (different devs work on different features)

