import { prisma } from "@/app/lib/prisma/prisma";
import { NextResponse } from "next/server";



export async function GET() {

    try {

        const data = await prisma.pet.findMany();

        if(!data || data.length === 0){
            return NextResponse.json({error: "No pets foud"}, {status: 404});
        }

        return NextResponse.json({ pets: data }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}