import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Health check endpoint
 * Used by Railway to monitor service health
 * Returns: { status: 'ok', timestamp, uptime, database, redis }
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

/**
 * Readiness check
 * Used by load balancers to determine if service can accept traffic
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false });
  }
});

/**
 * Liveness check
 * Simple check that service is running
 */
router.get('/alive', (req: Request, res: Response) => {
  res.json({ alive: true });
});

export default router;
