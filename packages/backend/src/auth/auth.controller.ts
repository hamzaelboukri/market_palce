import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('auth0')
  @UseGuards(AuthGuard('auth0'))
  async auth0Login() {
    // Initiates Auth0 login flow
  }

  @Get('callback')
  @UseGuards(AuthGuard('auth0'))
  async auth0Callback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.login(req.user);
    res.redirect(`http://localhost:3000/auth/callback?token=${token.access_token}`);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('validate-token')
  @UseGuards(AuthGuard('jwt'))
  validateToken(@Req() req: Request) {
    return { valid: true, user: req.user };
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    // For Auth0 logout, redirect to Auth0 logout endpoint
    const auth0LogoutUrl = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=http://localhost:3000`;
    res.redirect(auth0LogoutUrl);
  }
}
