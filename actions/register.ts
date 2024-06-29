"use server";

import * as z from 'zod';
import bcrypt from 'bcrypt';

import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/lib/user';

export const register = async (values: z.infer<typeof RegisterSchema>) => {

    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { email, password, name, username } = validatedFields.data;

    const saltPassword = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltPassword);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already in use" };
    }

    await db.user.create({
        data: {
            name,
            username,
            email,
            password: hashedPassword
        }
    })

    // TODO : Send verification token email

    return { success: "User created!" }
}