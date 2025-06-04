import { prisma } from "@/app/lib/prisma/prisma";
import { Resend } from "resend";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import ThankyouMessageTemplate from "@/app/lib/components/ThankyouMessageTemplate";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API);

export async function POST(request: NextRequest) {

    try {

        const cookieStore = await cookies();

        const email = cookieStore.get("email")?.value;

        if (!email) {
            return NextResponse.json({ error: "Email is missing" }, { status: 404 });
        }

        const { reporttype, lat, lng, type, status, contact, landmark, description, images } = await request.json();


        const pureL = await prisma.purel.create({
            data: {
                email,
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


        ///// SEND EMAIL TO USER ONCE REPORT IS DONE

        /// get username from cookies
        const username = cookieStore.get("username")?.value;

        await resend.emails.send({
            from: "PureL <noreply@jakejug.site>",
            subject: "Thankyou for Submitting your Report",
            to: [email],
            react: ThankyouMessageTemplate({ name: username || "User" }),
        });

        return NextResponse.json({ id: pureL.id }, { status: 200 });


    } catch (e) {

        return NextResponse.json({ success: false, message: "Save failed" }, { status: 400 });
    }
}


export async function PUT(request: NextRequest) {

    try {

        const { imageURL, reportID } = await request.json();

        await prisma.purel.update({
            data: {
                images: imageURL,
            },
            where: {
                id: reportID,
            }
        });

        return NextResponse.json({ message: "Succesfully Updates report" }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" });
    }
}