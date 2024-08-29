import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
            try {
                const response = await fetch(`e-commerce-website-production-ffa9.up.railway.app/login`, {
                    method: "POST",
                    headers: {'Content-Type': "application/json"},
                    body: JSON.stringify(credentials),
                });
                
                console.log("API hitted");
                const { user, role } = await response.json();
                console.log(role);
                if (!response.ok) {
                    throw new Error('Invalid credentials');
                } 

                if (user) {
                    return { ...user, role};
                } else {
                    return null;
                }

            } catch (error) {
                // Handle errors from the API response
                console.error("Error during authorizaiton", error);
                throw new Error("Invalid Credentials");
            }
        },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.role = user.role;
            token.username = user.username // Save role in token
        }
        return token;
    },
    async session({ session, token }) {
        if (token) {
            session.user.role = token.role;
            session.user.username = token.username; // Add role to session
        }
        return session;
    },
},
});
