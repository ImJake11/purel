"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ProgressType from "@/app/lib/enum/ProgressType";
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/lib/redux/store';
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from 'react-redux';
import { toggleReportProgress } from '@/app/lib/redux/reportProgressReducer';


export const ReportProgress = () => {

    const dispatch = useDispatch();

    const progressReducer = useSelector((state: RootState) => state.progress);

    const hasError = progressReducer.error.length > 0;
    const isOpen = progressReducer.isReportProgressOpen;

    const runningDog = <>
        <div className="w-[70%] place-self-center">
            <DotLottieReact
                src="https://lottie.host/bc6b54e3-9b1b-4ef7-9432-aa900440fd6b/6DcJQAMEnF.lottie"
                loop
                autoplay
            />
        </div>
    </>

    return <AnimatePresence>
        {isOpen && <motion.div className='w-screen h-screen absolute grid place-content-center'
            style={{
                backgroundColor: "rgba(43, 42, 42, .5)"
            }}

            initial={{
                opacity: 0,
            }}

            animate={{
                opacity: 1,
            }}

            exit={{
                opacity: 0,
            }}

            transition={{
                ease: "easeInOut",
                duration: .2
            }}
        >

            {/** main container */}
            <div className='max-w-[400px] w-[70vw] h-fit bg-white rounded-[11px] flex flex-col p-5'>
                {/** error container */}
                {progressReducer.error.length > 0 && <div className='w-full flex flex-col h-fit gap-1.5'>

                    <span className='text-[.8rem]'>Error occured:</span>
                    <div className='h-[.5rem]' />
                    <AnimatePresence>
                        {progressReducer.error.map((d, i) => <Error key={i} errorMsg={d} />)}
                    </AnimatePresence>
                </div>}
                <div className='h-[.5rem]' />
                {runningDog}

                <DataTile label='Submitting report' status={progressReducer.reportStatus} />
                {progressReducer.imagesStatus.map((image, i) => <DataTile key={i} label={`Image ${i + 1}`} status={image.status as ProgressType} />)}
                <DataTile label='Finalizing your report' status={progressReducer.finalizing} />
                <div className='h-[1rem]' />
                {hasError && <button className='h-[2.5rem] bg-orange-300 text-white rounded-[7px] w-[40%] place-self-center'
                    onClick={() => dispatch(toggleReportProgress())}
                >Dismiss</button>}
            </div>
        </motion.div>}
    </AnimatePresence>

}


const Error = ({ errorMsg }: { errorMsg: string }) => <motion.div
    className='w-full h-[2rem] bg-gray-200 rounded-[7px] grid items-center text-red-500 text-[.7rem] p-2.5 box-border'
    initial={{
        opacity: 0,
    }}

    animate={{
        opacity: 1,
    }}
>
    <span>{errorMsg}</span>
</motion.div>


interface DataTileProps {
    label: string,
    status: ProgressType,
}

const DataTile = ({ label, status }: DataTileProps) => <div className='w-full h-[3rem] text-[.8rem] flex items-center gap-2'>
    <FontAwesomeIcon icon={faCircleNotch} size="1x" />
    <span className='flex-[1]'>{label}</span>
    <div className={`w-fit h-fit p-[5px_7px_5px_7px] ${generateColor(status)} text-white rounded-[7px] uppercase    `}>{status}</div>
</div>

const generateColor = (status: ProgressType) => {
    if (status === ProgressType.PROCESSING) {
        return "bg-yellow-400";
    } else if (status === ProgressType.PENDING) {
        return "bg-orange-400";
    } else if (status === ProgressType.ERROR) {
        return "bg-red-500";
    } else {
        return "bg-green-300";
    }
}