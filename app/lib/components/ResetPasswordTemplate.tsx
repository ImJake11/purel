



interface ResetTemplateProps {
    name: string,
    token: string,
    email: string,
}

function ResetPasswordTemplate({ name, token, email }: ResetTemplateProps) {
    return <div className="flex flex-col text-[1rem] gap-3.5">
        <h3>Hi {name}!,</h3>
        <span>We received a request to reset your password. If you made this request, please click the link below to set a new password:</span><br />
        <a href={`http://localhost:3000/pages/reset-password/reset-password-form?token=${token}&email=${email}`}
            className="text-orange-300 underline underline-offset-2 text-[1rem]"
        >http://localhost:3000/reset-password/reset-password-form</a>
        <p>This link will expire in 10 minutes for your security. If it expires, you’ll need to request a new one.
            If you did not request a password reset, please ignore this email — your account remains safe.
        </p>
        <p>Thankyou,</p>
        <span>PureL</span>
    </div>
}



export default ResetPasswordTemplate;
