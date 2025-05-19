"use client";

import { AppDispatch, RootState } from "@/app/lib/redux/store";
import "@/app/styles/auth.css";
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import AppRouterInstance from "next/navigation";
import { NextRouter } from "next/router";
import AuthServices from "@/app/lib/services/auth/AuthenticationServices";
import { toggleVerifying } from "@/app/lib/redux/authReducer";

interface UserCredentialProp {
    name: string,
    password: string,
    email: string,
}


const EmailVerification = ({ credentials, router, dispatch }:
    {
        dispatch: AppDispatch,
        credentials: UserCredentialProp,
        router: any,

    }) => {


    const [inputCode, setInputCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [showNotif, setShowNotif] = useState(false);
    const [notifMsg, setNotifMsg] = useState("");
    const [isError, setIsError] = useState(false);
    const [isResendingCode, setResendingCode] = useState(false);

    const authReducer = useSelector((state: RootState) => state.auth);
    const authServices = new AuthServices(credentials, dispatch);


    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {

        const value = event.target.value.replace(/\D/g, "");

        if (value.length <= 6) {
            setInputCode(value);
        }
    }


    // AUTOMATICALLY VERIFY USER CODE WHEN IT MATCHED THE GIVEN CODE
    useEffect(() => {

        const verifyUser = async () => {

            const status = await authServices.verifyUser();

            if (status === "error") {
                setNotifMsg("Problem occurs verifying user");
                setShowNotif(true);
                setIsError(true);
                return;
            } else {
                setNotifMsg("User verified");
                setShowNotif(true);
                setIsError(false);

                /// MEANS USER IS VERIFIED
                router.replace("/pages/report-form");
            }
        }

        if (timeRemaining !== 0 && inputCode === authReducer.code) {
            setIsLoading(true);
            verifyUser();
        }

    }, [inputCode]);




    /// COUNTDOWN TIMER 
    useEffect(() => {

        if (!authReducer.timeExpiredAt) return;

        const expDate = new Date(authReducer.timeExpiredAt);

        console.log(expDate);

        const updateTime = () => {
            const now = new Date();
            const diff = expDate.getTime() - now.getTime();

            if (diff <= 0) {
                setShowNotif(true);
                setIsError(true);
                setNotifMsg("The code has expired. Please resend the code to try again.")
                setTimeRemaining(0);
                setIsLoading(false);
                clearInterval(interval);
            } else {

                setTimeRemaining(diff);
            }
        };

        updateTime();

        //// update the countdown every second
        const interval = window.setInterval(updateTime, 1000);


        /// dispose the interval hook when page is not on screen anymore
        return () => clearInterval(interval);
    }, [authReducer.timeExpiredAt]);




    const handleResend = async () => {
        setResendingCode(true);

        const status = await authServices.resendCode();

        if (status === "error") {

            setResendingCode(false);
            setIsError(true);
            setShowNotif(true);
            setNotifMsg("Unable to send code due to problem.")
        } else {
            setResendingCode(false);
            setShowNotif(false);

        }
    }



    const inMinutes = () => {
        const totalSec = Math.floor(timeRemaining / 1000);

        return Math.floor(totalSec / 60);
    }

    const inSeconds = () => {
        const totalSec = Math.floor(timeRemaining / 1000);
        const value = totalSec % 60;
        return value < 10 ? "0" + value : value.toString();
    }

    return (
        <div className="verification-bg"
        >
            <div className='verification-con'>

                {showNotif && <motion.div className="error-msg"

                    animate={{
                        padding: showNotif ? "10px" : "0px",
                        backgroundColor: isError ? "red" : "lightGreen",
                    }}
                >
                    {showNotif && <span>
                        {notifMsg}</span>}
                </motion.div>}

                <p>We’ve sent a verification code to your Gmail. Please check your inbox or spam folder</p>

                <div className="input-con">
                    <input value={inputCode}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Enter 6 digit code"
                        maxLength={6}
                        onChange={handleInput} />
                </div>

                <button
                    type="submit"
                    disabled={timeRemaining === 0}
                >
                    {isLoading ? <>{loadingIndicator} <p>Verifying...</p> </>
                        :
                        <p>Verify</p>}
                </button>
                <button
                    type="submit"
                    className="cancel-btn"
                    onClick={() => {
                        dispatch(toggleVerifying());
                        authServices.cancelVerification()
                    }}
                >
                    Cancel
                </button>



                {/** COUNTDOWNN */}
                {timeRemaining !== 0 ? <span>Resend code in <span className="font-semibold text-[var(--primary)] underline" > {inMinutes()}:{inSeconds()}</span>
                </span> :
                    <>
                        {
                            isResendingCode ? <span>Resending your code please wait....</span> :
                                <span>Did not get the code? <span className="font-semibold text-[var(--primary)] underline" onClick={handleResend}> Resend it now</span>
                                </span>}
                    </>}
            </div>


        </div>
    )
}

export default EmailVerification




const loadingIndicator = <div
    className="loading-indicator">
</div>
