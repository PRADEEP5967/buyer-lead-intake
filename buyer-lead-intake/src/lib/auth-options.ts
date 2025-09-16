import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './db';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: (() => {
    const providers = [];
    
    // Add Google OAuth provider if credentials are available
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      providers.push(
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          allowDangerousEmailAccountLinking: true,
        })
      );
    }
    
    // Add credentials provider in non-production environment
    if (process.env.NODE_ENV !== 'production') {
      providers.push(
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
          },
          async authorize(credentials) {
            if (!credentials) return null;
            
            // For demo, allow any email with password 'password'
            if (credentials.password === 'password') {
              // Find or create user
              let user = await prisma.user.findUnique({
                where: { email: credentials.email },
              });

              if (!user) {
                user = await prisma.user.create({
                  data: {
                    email: credentials.email,
                    name: credentials.email.split('@')[0],
                    emailVerified: new Date(),
                  },
                });
              }

              return user;
            }
            return null;
          },
        })
      );
    }
    
    return providers;
  })(),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        // Default to 'USER' role if not specified
        role: 'USER' as const,
      };
    },
  },
  // Custom pages
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
