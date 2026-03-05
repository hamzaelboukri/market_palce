import { Strategy } from 'passport-http-bearer';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../auth.interface';
import { UsersService } from '../../users/users.service';
declare const Auth0UserInfoStrategy_base: new (...args: any[]) => Strategy<import("passport-http-bearer").VerifyFunctions>;
export declare class Auth0UserInfoStrategy extends Auth0UserInfoStrategy_base {
    private usersService;
    private readonly auth0Domain;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(token: string): Promise<AuthenticatedUser>;
}
export {};
