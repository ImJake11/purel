import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {

    try {

        const cookieStore = await cookies();
        const token = cookieStore.get("reset_token");

        if (!token) {
            return NextResponse.json({ message: "No token found" }, { status: 200 });
        }
        const parts = token.value.split(".");
        const [sessionToken, signature, expiresAt] = parts;

        const now = Math.floor(Date.now() / 1000);
        const expiresAtSeconds = Math.floor(Number(expiresAt) / 1000);

        const remainingTime = expiresAtSeconds - now;

        return NextResponse.json({ time: remainingTime }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        const parts = token.split(".");
        const [, , expiresAt] = parts;

        const now = Math.floor(Date.now() / 1000);
        const eat = Math.floor(Number(expiresAt) / 1000);

        if (eat > now) {
            return NextResponse.json({ message: "Token is available", isAvailable: true }, { status: 200 });
        }

        return NextResponse.json({ message: "Token is unavailable", isAvailable: false }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
