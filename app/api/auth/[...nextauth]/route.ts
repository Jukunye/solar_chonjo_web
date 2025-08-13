import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // 1. First get JWT tokens
          const tokenResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/create/`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!tokenResponse.ok) {
            throw new Error('Login failed');
          }

          const tokens = await tokenResponse.json();

          // 2. Then fetch user data using the access token
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${tokens.access}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await userResponse.json();

          // 3. Return combined data
          return {
            id: userData.id.toString(),
            email: userData.email,
            name:
              userData.name ||
              userData.username ||
              userData.email.split('@')[0],
            ...userData, // Include all user data
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
          };
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          ...user, // Include all user data in the token
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...token, // Include all token data in the session
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
