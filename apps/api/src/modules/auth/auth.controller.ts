import { Request, Response } from 'express';
import { AuthService, LoginInput, RegisterInput } from './auth.service';

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const result = await this.authService.login({ email, password } as LoginInput);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, clinicId } = req.body;

      if (!email || !password || !name || !clinicId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await this.authService.register({
        email,
        password,
        name,
        clinicId,
      } as RegisterInput);

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
