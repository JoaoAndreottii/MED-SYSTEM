# Med-System Development Guide

## Project Context

Med-System is a **medical clinic automation SaaS** (similar to ClinicaOS). The goal is to automate clinic operations completely while maintaining humanized, LGPD-compliant patient interactions.

**Current Status:** Phase 0 setup complete. Starting Phase 1 (Auth + Clinic Management).

## Architecture Overview

### Multi-Tenancy Pattern
Every API endpoint must isolate data by `clinicId`. This is enforced via:
1. **@UseTenant() decorator** - Extracts & validates clinic from JWT
2. **Service methods** - All take `clinicId` as parameter
3. **Repository queries** - Always filter by `clinicId`

### Module Structure
Each module follows this pattern:
```
modules/auth/
├── auth.service.ts     # Business logic
├── auth.controller.ts  # HTTP handlers
├── auth.routes.ts      # Route definitions
└── auth.types.ts       # Module-specific types
```

### Error Handling
- Global exception filter in `app.ts`
- Custom `AppError` class for business errors
- Never expose sensitive details in API responses

### Authentication
- JWT tokens stored in request object: `req.userId`, `req.clinicId`
- Bcrypt for password hashing (never store plain text)
- Role-based access control: ADMIN, DOCTOR, RECEPTIONIST, PATIENT

## Development Workflow

### 1. Adding a New Feature

**Example: Create a new endpoint `POST /appointments`**

#### Step 1: Update Prisma schema
```prisma
// prisma/schema.prisma
model Appointment {
  id    String @id @default(cuid())
  // ... fields
}
```

#### Step 2: Generate Prisma client
```bash
npm run prisma:generate
npm run prisma:migrate
```

#### Step 3: Create repository (data access)
```typescript
// src/repositories/appointment.repo.ts
export class AppointmentRepository {
  async create(data, clinicId: string) {
    return prisma.appointment.create({
      data: { ...data, clinicId }
    })
  }
}
```

#### Step 4: Create service (business logic)
```typescript
// src/modules/appointments/appointment.service.ts
export class AppointmentService {
  constructor(private repo: AppointmentRepository) {}
  
  async create(input: CreateAppointmentDto, clinicId: string) {
    // Validate inputs
    // Check conflicts
    // Trigger reminders
    return this.repo.create(input, clinicId)
  }
}
```

#### Step 5: Create controller (HTTP handler)
```typescript
// src/modules/appointments/appointment.controller.ts
export class AppointmentController {
  constructor(private service: AppointmentService) {}
  
  async create(req: Request, res: Response) {
    const { clinicId } = req  // From @UseTenant() guard
    const data = CreateAppointmentDto.parse(req.body)
    const result = await this.service.create(data, clinicId)
    res.json(result)
  }
}
```

#### Step 6: Add routes
```typescript
// src/routes/appointmentRoutes.ts
router.post(
  '/appointments',
  authenticate(),
  useTenant(),
  validate(CreateAppointmentDto),
  appointmentController.create
)
```

#### Step 7: Write tests
```typescript
// tests/appointments.test.ts
describe('AppointmentService', () => {
  it('creates appointment', async () => {
    const result = await service.create({...}, clinicId)
    expect(result).toHaveProperty('id')
  })
})
```

### 2. Working with Async Jobs

Example: Sending reminders every day

```typescript
// src/jobs/processors/reminder-dispatch.processor.ts
import { Worker, Job } from 'bullmq'

export const reminderDispatchWorker = new Worker(
  'reminder-dispatch',
  async (job: Job) => {
    const { clinicId } = job.data
    await reminderService.dispatchPending(clinicId)
  },
  { connection: redis }
)

// src/jobs/queues/reminder.queue.ts
export const reminderQueue = new Queue('reminder-dispatch', { connection: redis })

// Usage in controller
await reminderQueue.add('dispatch', { clinicId }, {
  repeat: { pattern: '0 9 * * *' } // 9 AM daily
})
```

### 3. Environment & Config

**DO NOT** use `process.env` directly. Always go through `config/env.ts`:

```typescript
// ❌ WRONG
const port = process.env.PORT

// ✅ RIGHT
import { env } from '@config/env'
const port = env.PORT  // Type-safe, validated
```

## Code Standards

### TypeScript Strictness
- `strict: true` in tsconfig.json
- No implicit `any` types
- Explicit return types on functions
- Use discriminated unions for type safety

### Naming Conventions
- **Files:** kebab-case.ts (e.g., `auth.service.ts`)
- **Classes:** PascalCase (e.g., `AppointmentService`)
- **Functions:** camelCase (e.g., `createAppointment`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)

### Imports
Use path aliases from tsconfig.json:
```typescript
// ✅ GOOD
import { AppointmentService } from '@modules/appointments'
import { AppError } from '@common/errors'

// ❌ AVOID
import { AppointmentService } from '../../modules/appointments'
```

### Comments
Only write comments explaining the **WHY**, not the **WHAT**:
```typescript
// ✅ GOOD
// Separate by 2 days to avoid alert fatigue
const REMINDER_INTERVAL_DAYS = 2

// ❌ BAD
// Set the interval
const REMINDER_INTERVAL_DAYS = 2
```

## Testing

### Unit Tests (Fast)
- Test individual services
- Mock dependencies
- Use Vitest

```typescript
describe('AppointmentService', () => {
  it('detects double-booking', async () => {
    const repo = mock(AppointmentRepository)
    repo.findByDoctor.mockResolvedValue([existing])
    
    const service = new AppointmentService(repo)
    await expect(() =>
      service.create(conflicting, clinicId)
    ).rejects.toThrow('Double-booking')
  })
})
```

### Integration Tests (Medium)
- Test full flow with real DB
- Setup & teardown fixtures
- Use test database

```typescript
describe('POST /appointments', () => {
  it('creates and sends reminder', async () => {
    const clinic = await createTestClinic()
    const doctor = await createTestDoctor(clinic)
    const patient = await createTestPatient(clinic)
    
    const res = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({ doctorId: doctor.id, patientId: patient.id, ... })
    
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
  })
})
```

### E2E Tests (Slow)
- Test complete user flows
- Simulate real scenarios
- Test integrations

## LGPD Compliance Checklist

- [ ] All sensitive fields (CPF, medical history) encrypted at DB
- [ ] Audit logs for all patient data access
- [ ] Patient consent tracked (`patient.consent`)
- [ ] PII redacted from logs
- [ ] Soft-delete support for GDPR requests
- [ ] Data export endpoint available
- [ ] Access control validated (no cross-clinic leaks)

## Common Mistakes to Avoid

### ❌ Forgetting Clinic Isolation
```typescript
// WRONG: No clinicId check
async getAppointments() {
  return prisma.appointment.findMany()  // Returns all clinics!
}

// RIGHT: Filter by clinicId
async getAppointments(clinicId: string) {
  return prisma.appointment.findMany({ where: { clinicId } })
}
```

### ❌ Unvalidated Input
```typescript
// WRONG: No validation
async create(req: Request) {
  const { name, email } = req.body
  return service.create(name, email)
}

// RIGHT: Validate with Zod
async create(req: Request) {
  const data = CreateDto.parse(req.body)  // Throws if invalid
  return service.create(data)
}
```

### ❌ Direct process.env Usage
```typescript
// WRONG
const port = process.env.PORT || 3000

// RIGHT
import { env } from '@config/env'
const port = env.PORT  // Throws at startup if missing
```

### ❌ Scattered Error Handling
```typescript
// WRONG: Try/catch everywhere
async create() {
  try {
    // ...
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// RIGHT: Global error filter handles it
async create() {
  // Throw AppError, let global filter catch it
  throw new AppError('Invalid input', 400)
}
```

## Performance Guidelines

### Database Queries
- Use `include` for related data, not N+1 queries
- Add indexes for frequently filtered columns
- Use `select` to return only needed fields

```typescript
// ❌ N+1 queries
const appointments = await prisma.appointment.findMany()
for (const apt of appointments) {
  apt.patient = await prisma.patient.findUnique({...})  // Loop query!
}

// ✅ Single query with include
const appointments = await prisma.appointment.findMany({
  include: { patient: true }
})
```

### Caching
- Cache clinic settings in Redis
- Cache doctor availability
- Cache patient segments for marketing

### Rate Limiting
- Implement per-clinic rate limits
- Prevent bulk reminder sending errors

## Deployment

### Docker
```bash
# Build image
docker build -t med-system-api:latest apps/api

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=... \
  -e REDIS_HOST=redis \
  med-system-api:latest
```

### Environment Variables Required
- `NODE_ENV` - development, staging, production
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_HOST` & `REDIS_PORT` - Redis connection
- `JWT_SECRET` - 32+ character secret key
- `JWT_EXPIRES_IN` - Token expiry (e.g., 24h)

## Monitoring & Logging

All logs include:
- `clinicId` - For clinic-scoped analysis
- `userId` - For audit trails
- `timestamp` - ISO 8601 format
- Redacted PII (no passwords, tokens, CPF)

```typescript
logger.info({ clinicId, appointmentId }, 'Reminder sent successfully')
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/auth-module

# Make changes, test thoroughly
npm run test

# Commit with clear message
git commit -m "feat: implement JWT authentication

- Add auth.service.ts with login/register
- Add UseTenant() decorator for clinic isolation
- Add JWT guard to protect routes"

# Push and create PR
git push origin feature/auth-module
```

## Next Immediate Steps (Phase 1)

1. **Environment Validation** (`src/config/env.ts`)
   - Zod schema for all env vars
   - Validation at startup

2. **Prisma Setup**
   - Generate client
   - Run migrations
   - Create fixtures

3. **Auth Module** (highest priority)
   - JWT generation/validation
   - Bcrypt hashing
   - Login endpoint
   - Test with Insomnia/Postman

4. **Clinic Module**
   - Clinic CRUD
   - Multi-tenant setup
   - Role assignment

5. **User Management**
   - User CRUD
   - Role-based access

## Questions or Issues?

- Check README.md for setup issues
- Check test files for usage examples
- Review error messages (they're descriptive!)
- Open an issue with context

---


