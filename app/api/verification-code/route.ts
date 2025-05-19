import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma/prisma";

export async function POST(request: NextRequest) {

    const { code, email } = await request.json();


    try {

        /// WE FIRST CHECK IF THE EMAIL IS CURRENTLY EXISTING IN THE DB
        /// SINCE EMAIL IS UNIQUE ITS POSSIBLE TO STORE IT IN THE DATABASE BUT IF THE USE
        /// DID NOT VERIFY THE ACCOUNT, THIS CODE WILL NOT BE DELETED ON ITS OWN
        /// SO I IMPLEMENT A LOGIC WHERE THE API WILL CHECK FIRST IF THE EMAIL IS EXISTING
        /// THEN IF YES JUST UPDATE THE VALUES THAT NEED TO UPDATE
        const newCode = await prisma.verificationCode.upsert({
            where: { email },
            update: {
                code,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
            create: {
                email,
                code,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
            select: {
                expiresAt: true,
            },
        });

        return NextResponse.json(
            { message: "successfully stored", expiresAt: newCode.expiresAt },
            { status: 200 }
        );
    } catch (e) {
        return NextResponse.json({ error: "Internal server or Api error" }, { status: 500 });
    }
}



export async function DELETE(request: NextRequest) {
    try {
        const { email } = await request.json();
        await prisma.verificationCode.delete({
            where: {
                email: email,
            }
        });

        return NextResponse.json({ message: "successfully deleted" }, { status: 200 })

    } catch (e) {
        return NextResponse.json({ message: "Error on deleting gmail" }, { status: 500 });
    }
}



export async function PUT(request: NextRequest) {

    try {

        const { email, code, } = await request.json();

        const { expiresAt } = await prisma.verificationCode.update({
            data: {
                code: code,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
            where: {
                email: email,
            },
            select: {
                expiresAt: true,
            }
        });


        return NextResponse.json({ message: "successfully Resend code", expiresAt: expiresAt }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}