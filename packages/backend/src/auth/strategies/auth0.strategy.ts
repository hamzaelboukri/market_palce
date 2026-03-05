import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    console.log('Initializing Auth0Strategy...');
    const domain = configService.get<string>('AUTH0_DOMAIN');
    const clientID = configService.get<string>('AUTH0_CLIENT_ID');
    console.log('Auth0 Domain:', domain);
    console.log('Auth0 ClientID:', clientID);

    super({
      domain,
      clientID,
      clientSecret: configService.get<string>('AUTH0_CLIENT_SECRET'),
      callbackURL: configService.get<string>('AUTH0_CALLBACK_URL'),
      scope: 'openid profile email',
      state: true, // Required for OAuth security with openid scope
    });
    console.log('Auth0Strategy initialized successfully.');
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.authService.validateUser(profile);
  }
}
