import { signIn, signOut, useSession } from "next-auth/react";
import generateCode from "../../functions/codeGenerator";
import { setCode, setTimeExpiration } from "../../redux/authReducer";
import { AppDispatch } from "../../redux/store";
import { toggleOff, toggleOn } from "../../redux/loadingReducer";
import AuthType from "../../enum/AuthType";
import { a, em } from "framer-motion/client";

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
                auth: AuthType.LOCALAUTH,
                name: this.data.name,
                password: this.data.password,
                email: this.data.email,
            }),
        });

        if (!addUserRequest.ok) {
            return "error";
        }
        const sessionRequest = await fetch("/api/session", {
            method: "POST",
            body: JSON.stringify({
                username: this.data.name,
                email: this.data.email,
            })
        });


        if (!sessionRequest.ok) {
            return "error";
        }

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


    //// CHECK IF THE USER EXISTS IN THE DATABASE
    /// AND CHECK USER AUTH METHOD USED WITH THIS EMAIL
    async getUserData(): Promise<any> {

        const checkRequest = await fetch(`/api/users/${this.data.email}`, {
            method: "GET",
        });

        const { userData } = await checkRequest.json();

        if (!checkRequest.ok) {
            console.log("error");
            throw Error("Api error");
        }

        return userData;
    }


    async localSignIn(): Promise<{
        success: boolean,
        message: string,
        username: string,
    }> {

        const request = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify({
                email: this.data.email,
                password: this.data.password,
                auth: AuthType.LOCALAUTH,
            })
        });

        if (!request.ok) {

            const { error } = await request.json();

            return {
                success: false,
                message: error,
                username: "",
            }
        }


        const { username } = await request.json();

        return {
            username: username,
            success: true,
            message: "Successfully logged in",
        }
    }
}

export default AuthServices;