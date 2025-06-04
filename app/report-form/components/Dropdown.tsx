"use client";

import { useState } from "react";
import { AnimatePresence, delay, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { updateFormData } from "@/app/lib/redux/formReducer";

const drorpdownArrow = (
  <svg viewBox="0 0 24 24" fill="none" height={30}>
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z"
        fill="#000000"
      ></path>{" "}
    </g>
  </svg>
);

interface DropdownProps {
  options: string[];
  label: string;
  selectedData: number,
  name: string
}

export default function Dropdown({ data }: { data: DropdownProps }) {

  const dispatch = useDispatch();

  const [isOpen, setOpen] = useState(false);


  const handleChange = (option: number) => {

    dispatch(updateFormData({ key: data.name, data: option }))

    setTimeout(() => {
      setOpen(false);
    }, 500);
  };

  const optionList = (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="w-full flex flex-col"
          initial={{
            transform: "translateX(-50px)",
            height: "0px",
            opacity: 0,
          }}
          animate={{
            height: "auto",
            opacity: 1,
            transform: "translateX(0px)",
          }}
          exit={{
            opacity: 0,
            height: "0px",
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.25,
            type: "tween",
            transform: { delay: 0.26 },
            opacite: { delay: 0.26 },
          }}
        >
          {data.options.map((o, i) => {


            const isSelected: boolean = data.selectedData === i;

            return (
              <motion.div
                key={i}
                className="w-full h-[50px] flex items-center gap-1.5"
                onClick={() => handleChange(i)}
              >
                {/** RADIO BUTTON */}
                <div className="rounded-full h-[20px] w-[20px] border-[1px] border-solid border-black grid place-items-center p-[2px]">
                  <motion.div
                    initial={{
                      scale: 0,
                    }}
                    animate={{
                      scale: isSelected ? 1 : 0,
                    }}
                    transition={{
                      ease: "linear",
                      duration: 0.25,
                    }}
                    className="w-full h-full rounded-full bg-[var(--primary)]"
                  ></motion.div>
                </div>
                {o}
              </motion.div>
            );
          })}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div className="w-full flex flex-col">
      <label className="flex text-[.7rem] gap-1.5 text-gray-600 before:content-['*'] before:text-[1rem]
          before:text-red-500
          ">
        {data.label}
      </label>
      <div className="w-full h-[4rem] border-orange-300 rounded-[7px] flex items-center justify-between box-border border-[2px] p-2"
        style={{
          boxShadow: "1px 1px 15px rgba(74, 85, 101, .5)"
        }}
        onClick={() => setOpen(!isOpen)}>
        <AnimatePresence mode="wait">
          <motion.span
            className="text-[1rem]"
            key={data.selectedData} // Ensures Framer Motion treats the text as a new element when `selected` changes
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {data.selectedData === -1 ? `Choose ${data.label}` : data.options[data.selectedData]}
          </motion.span>
        </AnimatePresence>
        <motion.div
          animate={{
            rotate: isOpen ? "180deg" : "0deg",
          }}
          transition={{
            type: "spring",
            bounce: 0.5,
          }}
        >
          {drorpdownArrow}
        </motion.div>
      </div>
      {optionList}
    </div>
  );
}
