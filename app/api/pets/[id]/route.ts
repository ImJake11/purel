import { prisma } from "@/app/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";




export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    const { id } = params;

    try {

        const data = await prisma.pet.findUnique({
            where: {
                id,
            }
        });

        return NextResponse.json({ petData: data }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}