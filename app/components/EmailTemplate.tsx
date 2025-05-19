

interface EmailTemplateProps {
    name: string,
    code: string,
}

function EmailTemplate({ name, code }: EmailTemplateProps) {
    return <div>
        <h3>Hello {name}!, this is your code to veify your email <span 
        style={{
            textDecoration: "underline",
            color: "orange"
        }}
        
        >{code}</span> Thankyou!.</h3>
    </div>
}



export default EmailTemplate;
