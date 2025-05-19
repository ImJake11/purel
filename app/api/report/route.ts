import { prisma } from "@/app/lib/prisma/prisma";
import { checkSessionTokenValidity } from "@/app/lib/services/session/SessionServices";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {

    console.log("POST METHOD HIT")

    try {


        const reqHeader = request.headers.get("authorization");

        const token = reqHeader?.split(" ")[1];

        if (!token) {
            return NextResponse.json({ message: "Invalid request, no session token found" }, { status: 400 });
        }

        const isValidToken = checkSessionTokenValidity(token);

        if (!isValidToken) {
            return NextResponse.json({ message: "Session token expires or Invalid" }, { status: 400 });
        }   


        const { reporttype, lat, lng, type, status, contact, landmark, description, images } = await request.json();


        const pureL = await prisma.purel.create({
            data: {
                reporttype,
                lat,
                lng,
                type,
                status,
                contact,
                landmark,
                description,
                images: images || [],
            },
            select: {
                id: true,
            }
        })

        return NextResponse.json({ success: true, id: pureL.id, message: "Successfully save to database" }, { status: 200 });


    } catch (e) {

        return NextResponse.json({ success: false, message: "Save failed" }, { status: 400 });
    }
}