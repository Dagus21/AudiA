// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'user-read-private user-read-email',
        },
      },
    }),
  ],
  callbacks: {
    async session(session, user) {
      session.userId = user.id;
      return session;
    },
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/sign-in-spotify',
    error: '/api/auth/error', // Página de error personalizada
  },
});

