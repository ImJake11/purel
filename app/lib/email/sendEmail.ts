import { Resend } from "resend";
import dotenv from "dotenv";
import EmailTemplate from "@/app/components/EmailTemplate";

dotenv.config();

const resend = new Resend(process.env.RESEND_API);


interface SendParams {
    name: string, code: string, email: string,
}


export async function sendEmail({ name, code, email }: SendParams) {

    const { data, error } = await resend.emails.send({
        from: "PureL <noreply@jakejug.site>",
        subject: "Email Verification",
        to: [email],
        react: EmailTemplate({ name: name, code: code }),
    });


    if (error) {
        throw new Error(error.message);
    }


    return data;


}