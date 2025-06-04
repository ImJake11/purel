
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dotenv from "dotenv";


dotenv.config({
    path: ".env",
});

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const secret = process.env.NEXTAUTH_SECRET;

if (!clientId || !clientSecret || !secret) {
    throw new Error("Crendentials are missing");
}


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: clientId,
            clientSecret: clientSecret,
        },

        ),
    ],
    secret: secret,
})


export { handler as POST, handler as GET };