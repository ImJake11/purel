"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react'
import "@/app/styles/auth.css";
import Link from "next/link";

const LoginPage = () => {

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [isError, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const gmailRegExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


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



    useEffect(() => {
        if (!gmailRegExp.test(credentials.email)) {
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
                <p className='title'>Welcome back!</p>

                <div className="form">
                    <p>Login in</p>
                    <motion.div
                        className="error-msg"
                        animate={{
                            minHeight: isError ? "fit-content" : "0px",
                            padding: isError ? "15px" : "0px",
                        }}
                    >
                        {errorMsg}
                    </motion.div>
                    <input
                        type="text"
                        name="email"
                        value={credentials.email}
                        placeholder='Enter your email'
                        onChange={handleCredentials}
                    />
                    <div className="passwords">
                        <input
                            value={credentials.password}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder='Enter your password'
                            onChange={handleCredentials}
                        />
                        <div
                            className="eye-con"
                            onClick={handleShowPassword}
                        >
                            {showPassword ?
                                <i className="ri-eye-fill"></i> : <i className="ri-eye-off-fill"></i>}
                        </div>
                    </div>

                    <span
                        className="text-gray-500 place-self-center mb-4.5 mt-4.5"
                    >Does'nt have an account?<Link href={"/pages/signup-page"}>
                            <span
                                className="text-gray-700 font-bold underline"> Create an account

                            </span>
                        </Link>
                    </span>

                    <button
                        type='submit'>Login</button>
                </div>
                <div className="or"></div>
                <div className="signup-options">
                    <div className="option-tile">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" />
                    </div>
                    <div className="option-tile">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/facebook/facebook-plain.svg" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
