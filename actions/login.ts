"use server";

import * as z from 'zod';
import bcrypt from 'bcrypt';

import { signIn } from '@/auth';
import { db } from '@/lib/db';
import { LoginSchema, RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/lib/user';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {

    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { email, password } = validatedFields.data;

    try {

        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credientials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }
        throw error;
    }
}