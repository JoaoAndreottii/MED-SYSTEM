import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../../server';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  clinicId: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
}

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
  private jwtExpiry = process.env.JWT_EXPIRES_IN || '24h';

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('User account is disabled');
    }

    const token = this.generateToken(user.id);

    return {
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
        role: 'ADMIN',
        clinics: {
          connect: { id: input.clinicId },
        },
      },
    });

    const token = this.generateToken(user.id);

    return {
      token,
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  verifyToken(token: string): { userId: string; clinicId?: string } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      return {
        userId: decoded.sub,
        clinicId: decoded.clinicId,
      };
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ sub: userId }, this.jwtSecret as Secret, {
      expiresIn: this.jwtExpiry,
    });
  }
}
