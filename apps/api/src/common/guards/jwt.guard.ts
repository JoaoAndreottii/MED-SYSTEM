import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../modules/auth/auth.service';

const authService = new AuthService();

export const jwtGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);

    (req as any).userId = decoded.userId;
    (req as any).clinicId = decoded.clinicId;

    next();
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
