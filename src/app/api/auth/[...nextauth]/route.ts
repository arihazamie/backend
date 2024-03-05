import { auth0ptions } from '../../../../lib/auth';
import NextAuth from "next-auth";

const handler = NextAuth(auth0ptions)

export { handler as GET, handler as POST }