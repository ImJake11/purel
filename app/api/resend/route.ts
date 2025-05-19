import EmailTemplate from "@/app/components/EmailTemplate";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API);

export async function POST(request: NextRequest) {


    try {

        const { name, code, email } = await request.json();


        const { data, error } = await resend.emails.send({
            from: "PureL <noreply@jakejug.site>",
            subject: "Email Verification",
            to: [email],
            react: EmailTemplate({ name: name, code: code }),
        });

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }

        return NextResponse.json({ submittedData: data });

    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }

}