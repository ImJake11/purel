import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/email/sendEmail";

export async function POST(request: NextRequest) {

    try {

        const { name, code, email } = await request.json();

        const data = await sendEmail({ name, code, email });

        return NextResponse.json({ submittedData: data });

    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }

}