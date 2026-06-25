import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import healthRouter from './routes/health';
import authRouter from './modules/auth/auth.routes';
import clinicRouter from './modules/clinic/clinic.routes';
import usersRouter from './modules/users/users.routes';
import appointmentsRouter from './modules/appointments/appointments.routes';
import remindersRouter from './modules/reminders/reminders.routes';
import noShowsRouter from './modules/noshows/noshows.routes';
import patientsRouter from './modules/patients/patients.routes';
import financialRouter from './modules/financial/financial.routes';
import examsRouter from './modules/exams/exams.routes';
import feedbackRouter from './modules/feedback/feedback.routes';
import marketingRouter from './modules/marketing/marketing.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRouter);
app.use('/auth', authRouter);
app.use('/clinics', clinicRouter);
app.use('/users', usersRouter);
app.use('/appointments', appointmentsRouter);
app.use('/reminders', remindersRouter);
app.use('/noshows', noShowsRouter);
app.use('/patients', patientsRouter);
app.use('/financial', financialRouter);
app.use('/exams', examsRouter);
app.use('/feedback', feedbackRouter);
app.use('/marketing', marketingRouter);

// 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export default app;
