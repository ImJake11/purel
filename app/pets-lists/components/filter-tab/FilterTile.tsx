"use client";

import { CloseIcon } from "@/app/lib/components/icons/CloseIcon"
import { removeFilter } from "@/app/lib/redux/filterReducer";
import React from "react"
import { useDispatch } from "react-redux";
import { motion } from "framer-motion"

const FilterTile = ({ data, label }: { label: string, data: any }) => {

    const dispatch = useDispatch();

    return <motion.div className="p-[5px_7px_5px_7px] bg-gray-200 rounded-[7px] text-[.7rem] flex gap-2.5"
        layout
        exit={{
            opacity: 0,
        }}

        transition={{
            duration: .2
        }}
    >
        <div className="flex flex-col gap-1"
            onClick={() => dispatch(removeFilter(label))}
        >
            <span className="text-[.7rem]  font-[600]">{data}</span>
            <span className="uppercase">{label}</span>

        </div>{<CloseIcon size={16} />}
    </motion.div>
}

export default FilterTile;