
import { prisma } from "@/app/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import dotenv from "dotenv";
import crypto from "crypto";
import { serialize } from "cookie";
import ResetPasswordTemplate from "@/app/lib/components/ResetPasswordTemplate";

dotenv.config();

const resend = new Resend(process.env.RESEND_API);

export async function POST(request: NextRequest) {

    const { email } = await request.json();

    try {

        if (!email) {
            return NextResponse.json({ error: "Email or Code is invalid" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                name: true,
                authMethod: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "No user found" }, { status: 404 });
        }

        if (user && user.authMethod !== "Local Auth") {
            return NextResponse.json({ error: "This email used different authentication method" }, { status: 400 });
        }


        const token = generateResetToken();

        const {  error } = await resend.emails.send({
            from: "PureL <noreply@jakejug.site>",
            subject: "Reset Password",
            to: [email],
            react: ResetPasswordTemplate({ name: user.name, token: token, email, }),
        });

        if (error) {
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        /// set http cookie 
        /// to determine the token validity 
        const cookie = serialize("reset_token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 10 * 60,
        });


        const response = NextResponse.json({
            message: "Email sent succesfful",
        }, { status: 200 });

        response.headers.set("Set-Cookie", cookie);

        ////

        return response;

    } catch (e) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}


function generateResetToken() {
    const privateKey = process.env.PRIVATE_KEY;
    const sessionToken = crypto.randomBytes(32).toString("base64");
    const expiresAt = Date.now() + 10 * 60 * 1000;

    if (!privateKey) {
        throw new Error("Missing PRIVATE_KEY in environment variables");
    }

    const payload = `${sessionToken}${expiresAt}`;
    const signature = crypto.createHmac("sha256", privateKey).update(payload).digest("base64");
    const combinedToken = `${sessionToken}.${signature}.${expiresAt}`;
    return combinedToken;
}