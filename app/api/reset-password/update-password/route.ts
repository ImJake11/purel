import { prisma } from "@/app/lib/prisma/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {

    try {

        const { password, email, } = await request.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: {
                email,
            },
            data: {
                password: hashedPassword,
            }
        });

        return NextResponse.json({ message: "Sucessfully update password" }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "Intenral Server error" }, { status: 500 });
    }

}