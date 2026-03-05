import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../auth.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class Auth0UserInfoStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly auth0Domain: string;

  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super();
    this.auth0Domain = configService.get<string>('AUTH0_DOMAIN', '');
  }

  async validate(token: string): Promise<AuthenticatedUser> {
    if (!token?.trim()) {
      throw new UnauthorizedException('Missing token');
    }
    if (!this.auth0Domain) {
      throw new UnauthorizedException('Auth0 not configured');
    }

    const res = await fetch(`https://${this.auth0Domain}/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new UnauthorizedException('Invalid token');
    }

    const profile = await res.json();
    const auth0Id = profile.sub;

    let user = await this.usersService.findByAuth0Id(auth0Id);

    if (!user) {
      user = await this.usersService.create({
        email: profile.email ?? `${auth0Id.replace('|', '-')}@auth0.user`,
        name: profile.name ?? profile.nickname ?? null,
        avatar: profile.picture ?? null,
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
