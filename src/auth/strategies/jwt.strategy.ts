// backend/src/auth/strategies/jwt.strategy.ts - Fixed
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    console.log('🔍 JWT payload validated:', { userId: payload.sub, email: payload.email });
    return { userId: payload.sub, email: payload.email };
  }
}