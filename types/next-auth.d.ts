import { DefaultUser } from 'next-auth';
import { UserRole } from '@prisma/client';
import { ZodNullableType } from 'zod';

declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & {
            id: string;
            username: string;
            email: string;
            emailVerified: Date | null;
            password: string;
            banner: string;
            role: UserRole;
            createdAt: Date;
            updatedAt: Date;
        };
    };
    interface User extends DefaultUser {
        id: string;
        username: string;
        email: string;
        emailVerified: Date | null;
        password: string;
        banner: string;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    };
};
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        email: string;
        emailVerified: Date | null;
        password: string;
        banner: string;
        role: UserRole;
        createdAt: Date;
        updatedAt: Date;
    };
};