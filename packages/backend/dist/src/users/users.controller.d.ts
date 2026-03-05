import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        auth0Id: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        stripeCustomerId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        auth0Id: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        stripeCustomerId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        auth0Id: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        stripeCustomerId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        auth0Id: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        stripeCustomerId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        auth0Id: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        stripeCustomerId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
