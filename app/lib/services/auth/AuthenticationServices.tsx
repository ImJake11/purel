import generateCode from "../../functions/codeGenerator";
import { setCode, setTimeExpiration } from "../../redux/authReducer";
import { AppDispatch } from "../../redux/store";

interface AuthProps {
    name: string,
    email: string,
    password: string,
}


class AuthServices {
    private data: AuthProps;
    private dispatch: AppDispatch;

    constructor(data: AuthProps, dispatch: AppDispatch) {
        this.data = data;
        this.dispatch = dispatch;
    }


    async sendCode(): Promise<string> {

        const code = generateCode();

        localStorage.setItem("isVerifying", "true");
        localStorage.setItem("email", this.data.email);


        const sendCode = await fetch("/api/verification-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code,
                email: this.data.email,
            }),
        });


        if (!sendCode.ok) {
            console.log("Sending code to postgre has error");
            return "error";
        }



        //// send the code to the user 

        const send = await fetch("/api/resend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: this.data.name,
                email: this.data.email,
                code: code,
            })
        });


        if (!send.ok) {
            console.log("sending code error");
            return "error";
        }

        const { expiresAt } = await sendCode.json();
        this.dispatch(setCode(code));
        this.dispatch(setTimeExpiration(expiresAt));
        console.log("Succeffuly sent the code");
        return "success";

    }

    //// RESET DATA WHEN USER CANCEL THE VERIFICATION
    async cancelVerification() {
        this.dispatch(setCode(""));

        const request = await fetch("/api/verification-code", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: this.data.email })
        });

        if (!request.ok) {
            return;
        }

    }

    async verifyUser(): Promise<string> {

        localStorage.removeItem("isVerifying");

        //// ADD USER TO THE DATABASE

        const addUserRequest = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: this.data.name,
                password: this.data.password,
                email: this.data.email,
            }),
        });

        if (!addUserRequest.ok) {
            return "error";
        }

        const { session } = await addUserRequest.json();


        /// add session key to the session storage
        sessionStorage.setItem("session", session);


        const removeVerificationCode = await fetch("/api/verification-code", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: this.data.email })
        });

        if (!removeVerificationCode.ok) {
            return "error";
        }


        return "success";
    }


    async resendCode(): Promise<string> {

        const code = generateCode();

        const send = await fetch("/api/resend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: this.data.name,
                email: this.data.email,
                code: code,
            })
        });


        if (!send.ok) {
            console.log("sending code error");
            return "error";
        }


        const resendRequest = await fetch("/api/verification-code", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.data.email,
                code: code,
            }),
        });


        if (!resendRequest.ok) {
            return "error";
        }

        const { expiresAt } = await resendRequest.json();

        this.dispatch(setTimeExpiration(expiresAt));
        this.dispatch(setCode(code));
        return "success";
    }

    async checkEmailExistence(): Promise<boolean> {

        const checkRequest = await fetch(`/api/users/${this.data.email}`, {
            method: "GET",
        });

        const { existing } = await checkRequest.json();

        if (!checkRequest.ok) {
            console.log("error");
            throw Error("Api error");
        }

        return existing;

    }

}

export default AuthServices;