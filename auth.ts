import NextAuth from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter'

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/lib/user";
import { getAccountByUserId } from "@/lib/account";
import { generateUsername, saveUsername } from "@/lib/username";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    update
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        // error: "/auth/error"
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            });
        }
    },
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        //     console.log({ user, account, profile, email, credentials });

        //     const existingUser = await getUserById(user.id);

        //     if (!existingUser) return true;

        //     if (existingUser.username) return true;

        //     const newUsername = await generateUsername(user.email as string);

        //     const savedUsername = await saveUsername(user.id, newUsername);

        //     return true
        // },
        async session({ token, session }) {
            console.log({ sessionToken: token, session });

            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (session.user) {
                session.user.name = token.name;
                session.user.username = token.username as string;
                session.user.email = token.email;
                session.user.bio = token.bio;
                session.user.isOAuth = token.isOAuth as boolean;
            }

            if (session.user.username) return session;

            const existingUser = await getUserById(session.user.id);

            if (!existingUser) return session;

            if (existingUser.username) return session;

            const newUsername = await generateUsername(session.user.email as string);

            const savedUsername = await saveUsername(session.user.id, newUsername);

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id);

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.username = existingUser.username;
            token.email = existingUser.email;
            token.bio = existingUser.bio;

            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig
});
