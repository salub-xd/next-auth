// import { auth } from "@/auth";
// import {
//     DEFAULT_LOGIN_REDIRECT,
//     apiAuthPrefix,
//     authRoutes,
//     publicRoutes
// } from '@/routes';

import { NextRequest, NextResponse } from "next/server";

// export default auth((req) => {

//     const { nextUrl } = req;
//     const isLoggedIn = !!req.auth;

//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//     const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//     const isAuthRoute = authRoutes.includes(nextUrl.pathname);

//     if (isApiAuthRoute) {
//         return;
//     }

//     if (isAuthRoute) {
//         if (isLoggedIn) {
//             return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//         }
//         return;
//     }

//     if (!isLoggedIn && !isPublicRoute) {
//         return Response.redirect(new URL('/', nextUrl));
//     }

//     return;

// });

export function middleware(request: NextRequest) {
    
}

// export async function middleware(req:NextRequest) {
//     const token = await getToken({
//         req, secret: process.env.AUTH_SECRET!,
//         salt: ""
//     });
  
//     if (!token) {
//       // Redirect to sign-in page if the token is not found
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
  
//     return NextResponse.next();
//   }

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}