"use client";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { removeImage } from "../redux/formReducer";
import { AnimatePresence, motion } from "framer-motion";

export default function SelectedPhotos() {
  const dispatch = useDispatch();

  const imgs = useSelector((state: RootState) => state.form.img);

  return (
    <motion.div className={`w-full flex gap-[10px] justify-center`}>
      <AnimatePresence>
        {imgs.map((img, i) => (
          <motion.div
            key={img}
            className={`flex-[1] flex flex-col gap-2`}
            layout
            style={{
              maxWidth: imgs.length === 1 ? "40vw" : undefined,
            }}
            animate={{
              scale: [0, 1],
            }}
            exit={{
              scale: 0,
            }}
            transition={{
              damping: 40,
              type: "spring",
              stiffness: 500,
            }}
          >
            <div className="h-[200px] w-full bg-gray-400 rounded-[5px] overflow-hidden">
              <img src={img} alt="" className="w-full h-full" />
            </div>
            <motion.button
              className="remove-btn"
              onClick={() => dispatch(removeImage(i))}
            >
              {removeIcon}
            </motion.button>
          </motion.div>
          
        ))}
      </AnimatePresence>
    </motion.div>
  );
}


const removeIcon = (
  <svg
    height={20}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>{" "}
    </g>
  </svg>
);
