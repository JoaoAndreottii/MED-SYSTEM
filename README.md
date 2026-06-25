# Med-System

**Medical clinic automation system** - Complete SaaS solution for clinic operations with 9 core modules.

## Overview

Med-System is an intelligent automation platform designed to streamline clinic operations:
- **Recepção Inteligente** - Smart reception with queue management
- **Agendamento** - Intelligent appointment scheduling with conflict detection
- **Lembretes Automáticos** - SMS/Email reminders (7d, 3d, 24h, 2h before)
- **Redução de Faltas** - No-show prediction and prevention
- **CRM de Pacientes** - Complete patient relationship management
- **Exames** - Exam scheduling and tracking
- **Financeiro** - Invoicing, billing, payment tracking
- **Pós-Consulta** - Follow-up and patient satisfaction surveys
- **Marketing** - Automated campaigns and retention

## Tech Stack

- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Queue:** BullMQ + Redis
- **Frontend:** Next.js + React (coming soon)
- **Authentication:** JWT + Bcrypt
- **Infrastructure:** Docker + Docker Compose

## Project Structure

```
med-system/
├── apps/
│   ├── api/                          # Backend API (Express)
│   │   ├── src/
│   │   │   ├── common/              # Guards, middleware, utilities
│   │   │   ├── config/              # Environment, database config
│   │   │   ├── modules/             # Feature modules (9 modules)
│   │   │   ├── repositories/        # Data access layer
│   │   │   ├── jobs/                # BullMQ processors
│   │   │   ├── database/            # Prisma schema
│   │   │   └── server.ts            # App bootstrap
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Database schema
│   │   │   └── migrations/          # Database migrations
│   │   ├── tests/                   # Test suite
│   │   └── docker/                  # Multi-stage Dockerfile
│   └── web/                         # Next.js frontend (WIP)
└── packages/                        # Shared libraries
    ├── types/                       # Shared TypeScript types
    ├── logger/                      # Structured logging
    └── validation/                  # Zod validation schemas
```

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 16+ (or use Docker)
- Redis (or use Docker)

### Installation

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd med-system
   npm install
   ```

2. **Start Infrastructure**
   ```bash
   npm run docker:up  # Starts PostgreSQL + Redis
   ```

3. **Setup Database**
   ```bash
   npm run prisma:migrate  # Create tables
   npm run prisma:seed     # Populate test data (optional)
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3000`

5. **View Database (optional)**
   ```bash
   npm run prisma:studio
   ```

## Development Workflow

### Scripts

```bash
# Development
npm run dev              # Start API in watch mode
npm run dev:web         # Start Next.js frontend

# Building
npm run build           # Compile TypeScript
npm run build:all       # Build API + Web

# Testing
npm run test            # Run all tests
npm run test:watch      # Run tests in watch mode
npm run lint            # ESLint checks
npm run format          # Prettier formatting

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Create new migration
npm run prisma:push     # Push schema to DB (dev only)
npm run prisma:seed     # Seed test data
npm run prisma:studio   # Open Prisma Studio UI

# Docker
npm run docker:up       # Start PostgreSQL + Redis
npm run docker:down     # Stop containers
npm run docker:reset    # Restart with fresh DB
```

## Architecture Decisions

### Multi-Tenancy
- **Clinic-centric design** - Every table has `clinicId`
- **Request guards** - `@UseTenant()` decorator validates clinic ownership
- **Isolation by default** - Cannot query across clinics

### Data Validation
- **Zod schemas** - All inputs validated before processing
- **DTO pattern** - Strict input/output contracts
- **Type safety** - Full TypeScript throughout

### Authentication
- **JWT tokens** - Stateless, scalable auth
- **Bcrypt hashing** - Industry-standard password storage
- **Role-based access** - ADMIN, DOCTOR, RECEPTIONIST, PATIENT

### Background Jobs
- **BullMQ** - Reliable queue system
- **Redis persistence** - Survives restarts
- **Automatic retries** - Configurable retry logic

## Implementation Phases

### Phase 0 ✅ Setup (This)
- [x] Monorepo structure
- [x] TypeScript & tooling
- [x] Docker infrastructure
- [x] Prisma schema design
- [ ] Environment configuration

### Phase 1 (Next)
- [ ] Auth module (JWT, Bcrypt)
- [ ] Clinic management (multi-tenant)
- [ ] User role system
- [ ] Test suite setup

### Phase 2
- [ ] Appointment scheduling
- [ ] Conflict detection
- [ ] Doctor availability
- [ ] BullMQ integration

### Phase 3
- [ ] Reminders (SMS/Email)
- [ ] No-show prediction
- [ ] Incentive system

### Phase 4
- [ ] CRM enhancements
- [ ] Financial module
- [ ] Analytics dashboard

### Phase 5+
- [ ] Exams, Marketing, AI integration
- [ ] Next.js frontend
- [ ] Mobile app

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://meduser:medpass@localhost:5432/medsystem

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-32-char-secret-key
JWT_EXPIRES_IN=24h

# Integrations (optional)
OPENAI_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
RESEND_API_KEY=...
```

## LGPD & Compliance

- ✅ Patient consent tracking
- ✅ Audit logging for all data access
- ✅ Data encryption fields (passwords, documents)
- ✅ Soft-delete support
- ✅ Structured logging with PII redaction

## Contributing

1. Create feature branch: `git checkout -b feature/module-name`
2. Make changes following the architecture
3. Run tests: `npm run test`
4. Format code: `npm run format`
5. Commit with clear message
6. Push and create PR

## Common Issues

### Database Connection Failed
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check credentials in .env
# Default: meduser:medpass@localhost:5432/medsystem
```

### Redis Connection Failed
```bash
# Verify Redis is running
docker ps | grep redis

# Check REDIS_HOST in .env (default: localhost:6379)
```

### Prisma Generation Error
```bash
# Regenerate Prisma client
npm run prisma:generate

# If still failing, reset schema
npm run docker:reset
npm run prisma:migrate
```

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [JWT.io](https://jwt.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

Proprietary - Med-System

---

**Status:** 🚀 Phase 0 Setup Complete - Ready for Phase 1 (Auth Module)

For issues or questions, check the CLAUDE.md file or contact the team.
