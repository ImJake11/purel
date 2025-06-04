import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { serialize } from "cookie";

export async function GET(request: NextRequest) {

    const cookiesStore = await cookies();

    const session = cookiesStore.get("session_key")?.value
    const username = cookiesStore.get("username")?.value;
    const email = cookiesStore.get("email")?.value;

    return NextResponse.json({ session, username, email }, { status: 200 });

}


export async function POST(request: NextRequest) {

    const { username, email } = await request.json();


    const maxAge = 7 * 24 * 60 * 60;

    const cookie = serialize("session_key", generateSessionKey(), {
        maxAge: maxAge,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
    });

    const usernameCookie = serialize("username", username, {
        maxAge: maxAge,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
    });


    const emailCookie = serialize("email", email, {
        maxAge: maxAge,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
    });


    const response = NextResponse.json({ message: "Session key generated" }, { status: 200 });

    response.headers.append("Set-Cookie", emailCookie);
    response.headers.append("Set-Cookie", cookie);
    response.headers.append("Set-Cookie", usernameCookie);


    return response;
}


export async function DELETE(request: NextRequest) {


    const expiredSessionKey = serialize("session_key", "", {
        path: "/",
        maxAge: 0,
    });

    const expiredUsername = serialize("username", "", {
        path: "/",
        maxAge: 0,
    });

    const expiredEmail = serialize("email", "", {
        path: "/",
        maxAge: 0,
    });


    const res = NextResponse.json({ message: "Credentials deleted" }, { status: 200 });

    res.headers.append("Set-Cookie", expiredSessionKey);
    res.headers.append("Set-Cookie", expiredUsername);
    res.headers.append("Set-Cookie", expiredEmail);

    return res;
}


export function generateSessionKey(): string {

    const privateKey = process.env.PRIVATE_KEY;
    const sessionToken = crypto.randomBytes(32).toString("base64");

    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in environment variables");
    }

    const payload = `${sessionToken}`;
    const signature = crypto.createHmac("sha256", privateKey).update(payload).digest("base64");
    const combinedToken = `${sessionToken}.${signature}`;
    return combinedToken;

}
