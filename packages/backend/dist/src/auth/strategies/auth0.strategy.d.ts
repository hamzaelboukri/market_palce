import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const Auth0Strategy_base: new (...args: any[]) => any;
export declare class Auth0Strategy extends Auth0Strategy_base {
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
