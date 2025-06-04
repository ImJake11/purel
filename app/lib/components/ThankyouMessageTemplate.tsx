





interface Props {
    name: string,
}

function ThankyouMessageTemplate({ name }: Props) {
    return <div className="flex flex-col text-[1rem] gap-3.5">
        <h3>Dear {name}!,</h3>
        <span>Thank you for submitting your report. We’ve successfully received it and will begin reviewing the details shortly.</span><br />
        <p>Thank you for submitting your report. We’ve successfully received it and will begin reviewing the details shortly.
        </p>
        <p>If we need any additional information, we’ll be sure to reach out. In the meantime, feel free to contact us if you have any questions or updates.</p>
        <span>We appreciate your time and effort!</span>
        <span>Best Regard,</span><br />
        <span>PureL</span>
    </div>
}



export default ThankyouMessageTemplate;
