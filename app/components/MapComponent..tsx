
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "../lib/redux/formReducer";
import { useSelector } from "react-redux";
import { RootState } from "../lib/redux/store";
import { motion } from "framer-motion";
import MapTile from "./MapTile";



export default function MapComponent({ isShow }: { isShow: boolean }) {
    const dispatch = useDispatch();

    const loadingReducer = useSelector((state: RootState) => state.loading);

    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const center = useSelector((state: RootState) => state.form.loc);


    useEffect(() => {
        const checkPermission = async () => {
            try {
                const result = await navigator.permissions.query({
                    name: "geolocation",
                }).then((state) => state.state);

                if (result === "granted" || result === "prompt") {
                    getLocation();
                } else {
                    setIsError(true);
                    setErrorMsg("Location permission is required to use this feature.");
                }
            } catch (err) {
                // Fallback for browsers that don't support Permissions API
                getLocation();
            }
        };

        checkPermission();



    }, []);


    useEffect(() => {
        getLocation();
    }, [loadingReducer]);



    function getLocation() {

        navigator.geolocation.getCurrentPosition((position) => {
            dispatch(setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            }));
        });
    }

    /// ERROR COMPONENT
    if (isError) return <div
        className="text-[14px] w-full h-full grid place-items-center text-red-500">{errorMsg}</div>;

    return (
        <motion.div
            className="flex flex-col gap-[10px] w-full overflow-hidden rounded-[8px]"
            initial={{
                minHeight: "200px",
                opacity: 1,

            }}
            animate={{
                minHeight: isShow ? "200px" : "0px",
                opacity: isShow ? 1 : 0
            }}
            transition={{
                duration: 0.3,
                ease: "linear",
                damping: 30,
                opacity: {
                    delay: 0.5,
                }
            }}
        >
            <MapTile data={center} />
            <span className="text-[16px] text-gray-500 ">
                This is your current location
            </span>
        </motion.div>
    );
}


