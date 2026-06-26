import express, { Request, Response } from 'express';
import healthRouter from './routes/health';
import authRouter from './modules/auth/auth.routes';
import clinicRouter from './modules/clinic/clinic.routes';
import usersRouter from './modules/users/users.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Minimal middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRouter);
// Temporarily disabled to debug 502 errors
// app.use('/auth', authRouter);
// app.use('/clinics', clinicRouter);
// app.use('/users', usersRouter);

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

export { getPrisma as prisma } from './lib/prisma';
export default app;
