import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthenticatedUser } from '../auth.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    const auth0Domain = configService.get<string>('AUTH0_DOMAIN', '');
    const audience = configService.get<string>('AUTH0_AUDIENCE', '');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
      }),
      audience: audience || undefined,
      issuer: auth0Domain ? `https://${auth0Domain}/` : undefined,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<AuthenticatedUser> {
    const auth0Id = payload.sub;
    let user = await this.usersService.findByAuth0Id(auth0Id);

    if (!user) {
      user = await this.usersService.create({
        email: payload.email ?? `${auth0Id.replace('|', '-')}@auth0.user`,
        name: payload.name ?? payload.nickname ?? null,
        avatar: payload.picture ?? null,
        auth0Id,
      });
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
