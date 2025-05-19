"use client";


import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/loading.css";
import { useSelector } from "react-redux";
import { RootState } from "../lib/redux/store";

export default function LoadingIndicator() {

    const loading = useSelector((state: RootState) => state.loading);


    const loadingUi = <>
        <div className="lottie-con">
            <DotLottieReact
                src="https://lottie.host/bc6b54e3-9b1b-4ef7-9432-aa900440fd6b/6DcJQAMEnF.lottie"
                loop
                autoplay
            />
        </div>
        <span>{loading.message}</span>
    </>

    const successUi = <>
        <div className="lottie-con"
        >
            <DotLottieReact
                src="https://lottie.host/09f43458-089c-4416-8cc3-c90479fb074d/wWZ2iL2HNW.lottie"
                autoplay
            />
        </div>
        <span>{loading.successMessage}</span>
    </>


    return <AnimatePresence>
        {loading.isOpen ? <motion.div className="loading-bg"

            animate={{
                opacity: [0, 1],

            }}


            exit={{
                opacity: 0,
            }}


            transition={{
                ease: "linear",
                duration: .25,
                damping: 400,
            }}


        >
            <div className="loading-con">
                {loading.isSuccess ? successUi : loadingUi}
            </div>
        </motion.div> : null}
    </AnimatePresence>
}