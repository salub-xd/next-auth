// import NextAuth from "next-auth"
// import { PrismaAdapter } from '@auth/prisma-adapter'
// import bcrypt from 'bcrypt';
// import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";

// import { db } from "@/lib/db";
// import { getUserByEmail, getUserById } from "@/lib/user";
// import { getAccountByUserId } from "@/lib/account";
// import { generateUsername, saveUsername } from "@/lib/username";
// import { LoginSchema } from "./schemas";

// export const {
//     handlers: { GET, POST },
//     auth,
//     signIn,
//     signOut,
// } = NextAuth({
//     providers: [
//         Google({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         }),
//         // Github({
//         //     clientId: process.env.GITHUB_CLIENT_ID,
//         //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//         // }),
//         Credentials({
//             async authorize(credentials) {
//                 const validatedFields = LoginSchema.safeParse(credentials);

//                 if (validatedFields.success) {
//                     const { email, password } = validatedFields.data;
//                     const user = await getUserByEmail(email);

//                     if (!user || !user.password) return null;

//                     const passwordMatchs = await bcrypt.compare(password, user.password);

//                     if (passwordMatchs) return user;

//                 }
//                 throw new Error("User not found.")
//                 ;
//             }
//         }) 
//     ],  
//     pages: {
//         signIn: "/login",
//     },
//     events: {
//         async linkAccount({ user }) {
//             await db.user.update({
//                 where: { id: user.id },
//                 data: { emailVerified: new Date() }
//             });
//         }
//     },
//     callbacks: {

//         // async signIn({ user, account, profile, email, credentials }) {
//         //     console.log({ user, account, profile, email, credentials });

//         //     const existingUser = await getUserById(user.id);

//         //     if (!existingUser) return true;

//         //     if (existingUser.username) return true;

//         //     const newUsername = await generateUsername(user.email as string);

//         //     const savedUsername = await saveUsername(user.id, newUsername);

//         //     return true
//         // },
//         async session({ token, session }) {
//             console.log({ sessionToken: token, session });

//             if (token.sub && session.user) {
//                 session.user.id = token.sub;
//             }

//             if (session.user) {
//                 session.user.name = token.name;
//                 // session.user.username = token.username as string;
//                 // session.user.email = token.email;
//                 // session.user.isOAuth = token.isOAuth as boolean;
//             }

//             // if (session.user.username) return session;

//             const existingUser = await getUserById(session.user.id);

//             if (!existingUser) return session;

//             if (existingUser.username) return session;

//             const newUsername = await generateUsername(session.user.email as string);

//             const savedUsername = await saveUsername(session.user.id, newUsername);

//             return session;
//         },
//         async jwt({ token }) {
//             if (!token.sub) return token;

//             const existingUser = await getUserById(token.sub);

//             if (!existingUser) return token;

//             const existingAccount = await getAccountByUserId(existingUser.id);

//             token.isOAuth = !!existingAccount;
//             token.name = existingUser.name;
//             token.username = existingUser.username;
//             token.email = existingUser.email;
//             token.bio = existingUser.bio;

//             return token;
//         }
//     },
//     adapter: PrismaAdapter(db),
//     session: { strategy: 'jwt' },
// });

// export const { handlers, auth, signIn, signOut } = NextAuth(config)



















import NextAuth from "next-auth"
import "next-auth/jwt"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcrypt';
import Credentials from "next-auth/providers/credentials";

import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/lib/user";
import { getAccountByUserId } from "@/lib/account";
import { generateUsername, saveUsername } from "@/lib/username";
import { LoginSchema } from "./schemas";

const config = {
    adapter: PrismaAdapter(db),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const user = await getUserByEmail(email);

                    if (!user || !user.password) return null;

                    const passwordMatchs = await bcrypt.compare(password, user.password);

                    if (passwordMatchs) return user;

                }
                throw new Error("User not found.");
            }
        })
    ],
    basePath: "/",
    callbacks: {
        async session({ token, session }) {
            console.log({ sessionToken: token, session });

            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (session.user) {
                session.user.name = token.name;
                // session.user.username = token.username as string;
                // session.user.email = token.email;
                // session.user.isOAuth = token.isOAuth as boolean;
            }

            // if (session.user.username) return session;

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
    experimental: {
        enableWebAuthn: true,
    },
    debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

declare module "next-auth" {
    interface Session {
        accessToken?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
    }
}