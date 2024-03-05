import { db } from '@/lib/database';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt"

export const auth0ptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt"
    },
    pages: {
      signIn: "/sign-in"                    
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
            email: { label: "Email", type: "text", placeholder: "ari@example.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
      
            if (!credentials?.email || !credentials?.password) {
              return null
            }

            const existingUser = await db.user.findUnique({
              where: {
                email: credentials.email
              }
            })
            if (!existingUser) {
              return null
            }
            
            const passwordMatch = await compare(credentials.password, existingUser.password)

            if (!passwordMatch) {
              return null
            }

            return {
              id: `${existingUser.id}`,
              username: existingUser.username,
              email: existingUser.email
            }
          }
        })
      ],
      callbacks: {
        async jwt({ token, user}) {
          if (user) {
            return {
              ...token,
              username: user.username
            }
          }

          return token
        },

        async session({ session, token, user }) {
          return {
            ...session,
            user: {
              ...session.user,
              username: token.username
            }
          }
        }
      }
}