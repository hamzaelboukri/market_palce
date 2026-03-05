import { UserRole } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    name?: string;
    avatar?: string;
    auth0Id?: string;
    role?: UserRole;
}
