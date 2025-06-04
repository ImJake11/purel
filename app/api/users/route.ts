import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {

    const { name, email, password, auth } = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    try {


        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });


        if (user) {
            return NextResponse.json({ message: "User already exists" }, { status: 500 });
        }

        await prisma.user.create({
            data: {
                name, email, authMethod: auth, password: hashedPassword,
            }
        });

        return NextResponse.json({ message: "User added to database" }, { status: 200 });

    } catch (e) {

        return NextResponse.json({ errro: "User already existed" }, { status: 400 });
    }


}