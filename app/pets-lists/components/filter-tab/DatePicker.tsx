"use client";

import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";

type DatePickerProps = {
    month: string,
    year: string,
    onCancel: () => void;
    onSave: (data: {
        month: string;
        year: string;
    }) => void;
};

const DatePicker = ({ onSave, onCancel, month, year }: DatePickerProps) => {

    const [date, setDate] = useState({
        month: "",
        year: "",
    })

    const _year = new Date().getFullYear();
    const _month = new Date().getMonth();


    useEffect(() => {
        if (month && year) {

            setDate({
                month: String(month),
                year: String(year),
            })
        } else {
            setDate({
                month: String(_month),
                year: String(_year),
            })
        }

    }, []);


    return (
        <motion.div className='absolute inset-0 grid place-content-center'
            style={{
                backgroundColor: "rgba(43, 42, 42,.3)"
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
        >
            <div className='flex flex-col gap-2 w-[320px] h-[60vh] bg-white rounded-[11px] p-2.5 overflow-hidden'>
                <h2>Date Picker</h2>
                {/** title */}
                <div className='flex w-full rounded-[6px] overflow-hidden'>
                    <Title data='month' />
                    <Title data='year' />
                </div>

                {/** details */}
                <div className='flex-[1] flex rounded-[7px] overflow-hidden'>

                    {/** month */}
                    <div className='no-scrollbar flex-[1] flex flex-col overflow-x-auto'>
                        {months.map((d, i) => <Details
                            key={i}
                            isSelected={Number(date.month) === i}
                            data={d}
                            onClick={() => setDate({ ...date, ["month"]: String(i) })}
                        />)}
                    </div>

                    {/** year */}
                    <div className='no-scrollbar flex-[1] flex flex-col overflow-x-auto'>
                        {Array.from({ length: 20 }).map((_, i) => <Details
                            key={i}
                            isSelected={Number(date.year) === _year - i}
                            data={_year - i}
                            onClick={() => setDate({ ...date, ["year"]: String(_year - i) })}
                        />)}
                    </div>
                </div>

                {/** buttons */}
                <div className='w-full flex justify-end gap-2'>
                    <button type="button"
                        className='min-h-[2rem] border border-gray-500 p-[0_10px_0_10px] text-gray-500 rounded-[3px]'
                        onClick={onCancel}
                    >Cancel</button>
                    <button type="button"
                        className='min-h-[2rem] bg-orange-300 p-[0_10px_0_10px] text-white rounded-[3px]'
                        onClick={() => {
                            onSave(date);
                        }}
                    >Save</button>
                </div>
            </div>
        </motion.div>
    )
}

const Details = ({ data, isSelected, onClick }: { data: any, isSelected: boolean, onClick: () => void }) => <div className={`flex-[1]  grid place-content-center min-h-[2.5rem] border ${isSelected ? "bg-orange-300" : "bg-gray-100"} ${isSelected ? "border-0" : " border border-gray-300"}`}
    onClick={onClick}
>
    <span className={`${isSelected ? "text-white" : "text-black"}`}>{data}</span>
</div>

const Title = ({ data }: { data: string }) => <div className='flex-[1] h-[2rem] bg-orange-300 text-white uppercase grid place-content-center'>
    {data}
</div>



const months: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default DatePicker
