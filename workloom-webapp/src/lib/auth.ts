import { z } from "zod";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authAPI } from "@/features/auth/api/auth";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXT_AUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await authAPI.login({ email, password });

                    return user as any;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.accessToken = user.accessToken;
                token.email = user.email;
                token.name = user.name;
                token.uuid = user.uuid;
            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.accessToken = token.accessToken;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.uuid = token.uuid;
            }

            return session;
        },
    },

    debug: true,
};