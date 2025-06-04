import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {

    if (req.method !== "POST") return NextResponse.json({ error: "Method not allowed" }, { status: 405 });

    const { email, password, auth } = await req.json();

    /// check email user from database
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });



    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user && user.authMethod !== auth) {
        return NextResponse.json({ error: "User not registered or used different authentication method" }, { status: 400 });
    }


    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
    }


    return NextResponse.json({ username: user.name }, { status: 200 });




}