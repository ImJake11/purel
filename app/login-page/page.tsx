"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react'
import "@/public/styles/auth.css";
import Link from "next/link";
import AuthServices from "@/app/lib/services/auth/AuthenticationServices";
import { useDispatch } from "react-redux";
import { redirect, useRouter } from "next/navigation";
import LoadingIndicator from "@/app/lib/components/LoadingIndicator";
import { signIn, useSession, signOut } from "next-auth/react";
import { toggleOff, toggleOn } from "@/app/lib/redux/loadingReducer";
import AuthType from "@/app/lib/enum/AuthType";

const LoginPage = () => {

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [isError, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const gmailRegExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    const router = useRouter();
    const dispatch = useDispatch();
    const { data: session, status } = useSession();


    const handleShowPassword = () => {
        setShowPassword(true);
        setTimeout(() => {
            setShowPassword(false);
        }, 2000);
    }

    const handleCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setCredentials({ ...credentials, [name]: value });
    }

    const handleGoogleSignIn = async () => {
        dispatch(toggleOn("Signin in with Google"));
        await signIn("google");

    }

    const handleLocalSignIn = async () => {
        setError(false);
        dispatch(toggleOn("Signing in"));

        const { email, password } = credentials;

        if (email === "" || password === "") {

            setError(true);
            setErrorMsg("Please fill in all fields");
            dispatch(toggleOff());
            return;
        }

        if (!gmailRegExp.test(email)) {
            setError(true);
            setErrorMsg("Please fill in all fields");
            dispatch(toggleOff());
            return;
        }

        const authService = new AuthServices({
            email,
            name: "",
            password,
        }, dispatch);


        const { success, message, username } = await authService.localSignIn();


        if (!success) {
            setError(true);
            setErrorMsg(message);
            dispatch(toggleOff());
            return;
        }

        await setSession(username, credentials.email);
        setError(false);
        router.replace("/report-form");
    }


    /// SET SESSION KEY
    const setSession = async (username: string, email: string) => {

        const sessionRequest = await fetch("/api/session", {
            method: "POST",
            body: JSON.stringify({ username, email: email }),
            headers: {
                "Content-Type": "application/json",
            }
        });


        if (!sessionRequest.ok) {
            console.error("Failed to set session key");
            return;
        }


        console.log("Session  key set successfully");
        setTimeout(() => {
            router.replace("/report-form");
        }, 500);
    }


    useEffect(() => {
        dispatch(toggleOff());
    })


    useEffect(() => {
        const registerUser = async () => {

            if (status === "authenticated") {

                /// ONCE USER IS AUTHENTICATED ADD EMAIL TO COOKIES
                if (session.user) {
                    const res = await fetch("/api/session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: session.user.name,
                            email: session.user.email,
                        }),
                    })

                    if (!res.ok) {
                        setErrorMsg("Failed to login via google");
                        setError(true);
                        return;
                    }

                }

                /// check the user if it is existing on database

                const authService = new AuthServices({
                    email: session.user?.email || "",
                    name: session.user?.name || "",
                    password: "__oauth__", // placeholder, as password is not used for OAuth
                }, dispatch);

                const userData = await authService.getUserData();


                if (userData && session.user && userData.authMethod === AuthType.OAUTH) {
                    await setSession(session.user.name!, session.user.email!);
                    return;

                } else if (userData && userData.authMethod !== AuthType.OAUTH) {

                    setErrorMsg("User already exists with a different authentication method. Please login with the correct method.");
                    setError(true);
                    await signOut();
                    dispatch(toggleOff());
                    return;

                } else if (!userData && session.user?.email) {

                    const request = await fetch("/api/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            auth: AuthType.OAUTH, // or use your `AuthType.OAUTH` enum
                            name: session.user?.name,
                            email: session.user?.email,
                            password: "__oauth__", // placeholder
                        }),
                    });

                    if (request.ok) {
                        await setSession(session.user.name!, session.user.email!);

                    }
                }

            }
        };

        registerUser();
    }, [session]);


    useEffect(() => {
        if (credentials.email !== "" && !gmailRegExp.test(credentials.email)) {
            setError(true);
            setErrorMsg("Invalid Email Address");
        } else {
            setError(false);
            setErrorMsg("");
        }
    }, [credentials]);



    return (
        <div className='login-page'>
            <div className="bg-object"></div>
            <div className="main-body">
                <div className="flex flex-col justify-center w-full items-center">
                    <p className='title'>Welcome back!</p>
                    <motion.div
                        className="w-full rounded-[11px] bg-red-500 mb-[20px] box-border p-2.5 text-white flex items-center"
                        initial={{
                            opacity: .0,
                            height: "0px",
                        }}
                        animate={{
                            opacity: isError ? .9 : .0,
                            height: isError ? "60px" : "0px",
                        }}
                    >
                        {errorMsg}
                    </motion.div>
                    <input
                        type="text"
                        name="email"
                        value={credentials.email}
                        placeholder='Enter your email'
                        className="w-full"
                        onChange={handleCredentials}
                    />
                    <div className="flex relative w-full h-[70px]">
                        <input
                            value={credentials.password}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder='Enter your password'
                            className="w-full absolute"
                            onChange={handleCredentials}
                        />
                        <div
                            className="text-[var(--primary)] w-[50px] h-[55px] grid place-items-center right-0 absolute"
                            onClick={handleShowPassword}
                        >
                            {showPassword ?
                                <i className="ri-eye-fill"></i> : <i className="ri-eye-off-fill"></i>}
                        </div>
                    </div>
                    <span
                        className="text-gray-500 place-self-center mb-4.5 mt-4.5"
                    >Forgot your password?<Link href={"/reset-password"}>
                            <span
                                className="text-gray-700 font-bold underline"> Reset it here
                            </span>
                        </Link>
                    </span>


                    <button
                        type='submit'
                        onClick={handleLocalSignIn}
                    >Login
                    </button>
                    <span
                        className="text-gray-500 place-self-center mb-4.5 mt-4.5"
                    >Does'nt have an account?<Link href={"/pages/signup-page"}>
                            <span
                                className="text-gray-700 font-bold underline"> Create an account

                            </span>
                        </Link>
                    </span>
                </div>
                <div className="or"></div>
                <div className="signup-options">
                    <div className="option-tile"
                        onClick={handleGoogleSignIn}
                    >
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" />
                    </div>
                    { /** <div className="option-tile">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/facebook/facebook-plain.svg" />
                    </div> */}
                </div>
            </div>
            <LoadingIndicator />
        </div>
    )
}

export default LoginPage
