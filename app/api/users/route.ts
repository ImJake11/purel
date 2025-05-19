import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma";
import bcrypt from "bcryptjs";
import { generateSessionKey } from "@/app/lib/services/session/SessionServices";



export async function POST(request: NextRequest) {

    const { name, email, password } = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);



    try {

        const sessionKey = generateSessionKey(email);

        await prisma.user.create({
            data: {
                name, email, password: hashedPassword,
            }
        });

        return NextResponse.json({ session: sessionKey }, { status: 200 });

    } catch (e) {

        return NextResponse.json({ errro: "User already existsd" }, { status: 400 });
    }


}