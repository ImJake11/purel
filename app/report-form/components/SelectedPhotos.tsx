"use client";

import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";

import { AnimatePresence, motion } from "framer-motion";
import { RootState } from "@/app/lib/redux/store";
import { removeImage, updateFormData } from "@/app/lib/redux/formReducer";

export default function SelectedPhotos() {
  const dispatch = useDispatch();

  const images = useSelector((state: RootState) => state.form.images);

  return (
    <motion.div className={`w-full flex gap-2 justify-center m-[1rem_0_1rem_0]`}
      initial={{
        minHeight: "0rem"
      }}
      animate={{
        minHeight: images.length > 0 ? "10rem" : "0rem",
      }}

      transition={{
        delay: images.length > 0 ? .3 : 0,
      }}
    >
      <AnimatePresence>
        {images.map((img, i) => (
          <motion.div
            key={img}
            className={`flex-[1] flex flex-col`}
            layout
            style={{
              maxWidth: images.length === 1 ? "40vw" : undefined,
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
              ease: "linear",
              type: "tween",
              delay: .3,
            }}
          >
            <motion.div className="relative h-[10rem] w-full bg-gray-400 rounded-[16px] overflow-hidden"
              whileHover={{
                scale: 1.1,
              }}
              style={{
                boxShadow: " 1px 1px 10px rgba(74, 85, 101, .6),  -1px -1px 10px rgba(74, 85, 101, .6)"
              }}
            >
              <img src={img} alt="" className="w-full h-full" />
              <motion.button
                className="absolute right-1 top-1 w-[2rem] h-[2rem] rounded-full bg-orange-300 grid place-content-center place-self-center"
                onClick={() => dispatch(removeImage(i))}
              >
                {removeIcon}
              </motion.button>
            </motion.div>
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
