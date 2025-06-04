import { prisma } from "@/app/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";




export async function GET(
    req: NextRequest,
    { params }: { params: { email: string } }) {

    try {

        const email = decodeURIComponent(params.email);

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        return NextResponse.json({ userData: user }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}