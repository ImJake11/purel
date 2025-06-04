

import { ReportType } from '@/app/lib/enum/ReportType'
import formReducer, { updateFormData } from '@/app/lib/redux/formReducer'
import { RootState } from '@/app/lib/redux/store'
import { AnimatePresence, motion } from 'framer-motion'
import { data } from 'framer-motion/client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const LandmarkTf = () => {
    const dispatch = useDispatch();
    const formReducer = useSelector((state: RootState) => state.form);

    const isPinLoc = formReducer.reportType === ReportType.DEVICELOCATION;

    return (
        <AnimatePresence>
            {!isPinLoc && (
                <motion.div
                    className="landmark w-full flex flex-col"
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
                        duration: 0.25,
                        delay: .3,
                    }}
                >
                    <label className="flex text-[.7rem] gap-1.5 text-gray-600 before:content-['*'] before:text-[1rem]
                     before:text-red-500
                    ">
                        Provide Landmark
                    </label>
                    <textarea
                        value={formReducer.landmark}
                        name="landmark"
                        minLength={5}
                        placeholder="ex. Beside Robinsons Place, Pulilan"
                        style={{
                            boxShadow: "1px 1px 15px rgba(74, 85, 101, .5)"
                          }}
                        onChange={(e) => {
                            const { name, value } = e.target;

                            dispatch(updateFormData({ key: name, data: value }))
                        }}
                        className="border-[2px] border-solid border-[var(--primary)] rounded-[7px] p-[5px] text-[1rem]"
                    ></textarea>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default LandmarkTf
