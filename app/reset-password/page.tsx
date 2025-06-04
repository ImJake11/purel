"use client";


import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import LoadingIndicator from '@/app/lib/components/LoadingIndicator';
import { useDispatch } from 'react-redux';
import { toggleOff, toggleOn } from '@/app/lib/redux/loadingReducer';
import { useRouter } from 'next/navigation';

const inputStyles = "min-h-14 border border-[var(--primary)] rounded-[11px] w-full text-center";
const buttonStyle = 'w-[150px] min-h-[50px] rounded-[11px] bg-[var(--primary)] text-white';
const gmailRegExp = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


const page = () => {

    const [isSubmitted, setSubmit] = useState<boolean>(false);
    const [email, setEmail] = useState("");
    const [isError, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [currentSeconds, setCurrentSeconds] = useState(0);

    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async () => {

        if (gmailRegExp.test(email)) {
            dispatch(toggleOn("Sending verification code..."));

            setError(false);


            const request = await fetch("/api/reset-password", {
                "method": "POST",
                body: JSON.stringify({
                    email: email,

                }),
            });

            if (!request.ok) {

                const { error } = await request.json();
                dispatch(toggleOff());
                setErrorMsg(error);
                setError(true);
                return;
            }


            setSubmit(true);
            setCurrentSeconds(10 * 60);
            dispatch(toggleOff());
        }
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmail(value);
    }


    //// CHECH IF RESET TOKEN IS EXISTING IN COOKIES
    useEffect(() => {
        const getToken = async () => {
            const request = await fetch("/api/reset-password/token-expiration", {
                method: "GET",
            });

            if (!request.ok) {
                return;
            }

            const { time } = await request.json();

            if (time) {
                setCurrentSeconds(time);
                setSubmit(true);
            }
        }
        getToken();
    }, []);


    //// timer
    useEffect(() => {

        const timeout = setTimeout(() => {
            if (currentSeconds > 0) {
                setCurrentSeconds(prev => prev - 1);
            }
        }, 1000);



        return () => {
            clearTimeout(timeout);
        }
    }, [currentSeconds]);


    React.useEffect(() => {

        if (email != "" && !gmailRegExp.test(email)) {
            setErrorMsg("Please enter a valid gmail address");
            setError(true);
        } else {
            setError(false);
        }
    }, [email]);


    /// COMPONENTS 
    const EnterEmail = <motion.div

        className='flex flex-col min-w-[100%] justify-evenly items-center'>
        {isError && <p className='text-red-500'>{errorMsg}</p>}
        <p>Enter you email here</p>
        <input type="email" name="email" value={email}
            className={inputStyles}
            onChange={handleInput}
        />
        <button type="submit"
            className={buttonStyle}
            onClick={handleSubmit}
        >Submit</button>


    </motion.div>



    const VerifyEmail = <motion.div
        className='flex flex-col justify-center items-center h-full min-w-[100%] gap-3.5'>

        <h3 className='font-semibold'>We’ve sent you an email!</h3>
        <p className='text-[.8rem] text-justify'>If an account with your email exists, you’ll receive a message with a link to reset your password.
            Please check your inbox (and spam folder just in case).
            The link will expire in 10 minutes ({currentSeconds}) for security purposes.</p>

        <button className='w-fit h-fit p-[10px_15px_10px_15px] text-white bg-orange-300 rounded-[11px]'
            onClick={() => router.replace("/login-page")}
        >Back to Login page</button>
        {currentSeconds === 0 && <button type="submit"
            className='w-fit h-fit p-[10px_15px_10px_15px] text-white bg-[var(--primary)] rounded-[11px]'
            onClick={() => setSubmit(false)}
        >
            Resend Link
        </button>}
    </motion.div>



    return (
        <div className='w-screen h-screen bg-[var(--primary)] relative '>
            <motion.div
                className='flex overflow-hidden w-[80dvw] h-[300px] max-w-[400px] bg-white rounded-[21px] p-[30px_20px_30px_20px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]'

            >

                <AnimatePresence mode='wait'>
                    {!isSubmitted ? EnterEmail : VerifyEmail}
                </AnimatePresence>

            </motion.div>
            <LoadingIndicator />
        </div>
    )
}

export default page



