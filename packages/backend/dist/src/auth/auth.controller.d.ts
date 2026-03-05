import { AuthService } from './auth.service';
import { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    auth0Login(): Promise<void>;
    auth0Callback(req: Request, res: Response): Promise<void>;
    getProfile(req: Request): Express.User;
    validateToken(req: Request): {
        valid: boolean;
        user: Express.User;
    };
    logout(req: Request, res: Response): Promise<void>;
}
