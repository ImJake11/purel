"use client";

import LoadingIndicator from '@/app/lib/components/LoadingIndicator'
import { toggleOff, toggleOn } from '@/app/lib/redux/loadingReducer';
import { redirect, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

const inputStyles = "min-h-14 border border-[var(--primary)] rounded-[11px] w-full text-center";

const page = () => {

    const dispatch = useDispatch();

    const searchParam = useSearchParams();
    const [isTokenAvailable, setTokenAvailable] = useState(false);
    const [isError, setError] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [passwords, setPasswords] = useState({
        confirmPassword: "",
        password: "",
    });
    const [isShowPassword, showPassword] = useState(false);

    const token = searchParam.get("token");
    const email = searchParam.get("email");

    const handlePasswords = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        setPasswords({ ...passwords, [name]: value });
    }


    const handleShowPassword = () => {
        showPassword(true);
        setTimeout(() => {
            showPassword(false);
        }, 3000);
    }


    const handleSubmitPassword = async () => {
        setErrorMsg("");
        setError(false);
        dispatch(toggleOn("Resetting your password"));

        const request = await fetch("/api/reset-password/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: passwords.password,
                email: email,
            }),
        });

        if (!request.ok) {
            setErrorMsg("Somthing went wrong");
            setError(true);
            dispatch(toggleOff());
            return;
        }

        dispatch(toggleOn("Successfully updated your password!"));
        setTimeout(() => {
            dispatch(toggleOn("Redirecting to login page...."))
          
            redirect("/login-page");
        }, 2000);
    }
    //// CHECK PASSWORDS 
    useEffect(() => {
        if (passwords.password.length < 8) {
            setErrorMsg("Password must be at least 8 characters long");
            setError(true);
        } else if (passwords.password.length >= 8 && passwords.confirmPassword !== passwords.password) {
            setErrorMsg("Password did not match");
            setError(true);
        } else {
            setErrorMsg("");
            setError(false);
        }
    }, [passwords]);

    //// CHECK TOKEN
    useEffect(() => {

        const getToken = async () => {
            setIsChecking(true);
            setError(false);

            const request = await (fetch("/api/reset-password/token-expiration", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token }),
            }));

            if (!request.ok) {
                return;
            }

            const { isAvailable } = await request.json();

            setError(false);
            setTokenAvailable(isAvailable);
            setIsChecking(false);
        }

        if (token) {
            getToken()
        }
    }, []);


    return (
        <div className='w-screen h-screen bg-[var(--primary)] relative '>
            <div
                className='flex flex-col w-[80dvw] max-w-[400px] bg-white rounded-[21px] p-[30px_40px_30px_40px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] h-fit gap-4'
            >

                {isError && <p
                    className='text-[1rem] text-red-400 place-self-center'>{errorMsg}
                </p>}
                {
                    isChecking ? <p className='text-center'>Checking link...</p> :
                        isTokenAvailable ? <>
                            <p className='text-[1.5rem] font-semibold'>Set new password</p>
                            <input type={isShowPassword ? "text" : "password"} name="password" placeholder='New Password'
                                className={inputStyles}
                                onChange={handlePasswords}
                                value={passwords.password}
                            />
                            <input type={isShowPassword ? "text" : "password"} name="confirmPassword" placeholder='Confirm Password'
                                className={inputStyles}
                                onChange={handlePasswords}
                                value={passwords.confirmPassword}
                            />

                            <span className='place-self-end cursor-pointer'
                                onClick={handleShowPassword}
                            >...<span className='underline underline-offset-3 text-[.8rem]'>show passwords</span>
                            </span>

                            <button
                                type="submit"
                                className='w-[150px] min-h-[50px] rounded-[11px] bg-[var(--primary)] place-self-center'
                                onClick={handleSubmitPassword}
                            >Set Password</button>

                        </> : <p className='text-center'>
                            This reset password link is expired.
                        </p>}


            </div>
            <LoadingIndicator />
        </div>
    )
}

export default page
