import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
authOptions.pages = {
    signIn: "/login",
    newUser: "/feed",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
