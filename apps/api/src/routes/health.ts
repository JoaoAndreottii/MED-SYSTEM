import { Router, Request, Response } from 'express';
import { prisma } from '@config/database';

const router = Router();

/**
 * Health check endpoint
 * Used by Railway to monitor service health
 * Returns: { status: 'ok', timestamp, uptime, database, redis }
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // TODO: Add Redis health check when configured
    // const redisConnected = await redis.ping() === 'PONG'

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        database: 'connected',
        // redis: redisConnected ? 'connected' : 'disconnected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
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
