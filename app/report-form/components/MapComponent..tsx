
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";

import { AnimatePresence, motion } from "framer-motion";
import MapTile from "./MapTile";
import { RootState } from "@/app/lib/redux/store";
import { updateFormData } from "@/app/lib/redux/formReducer";
import { ReportType } from "@/app/lib/enum/ReportType";


export default function MapComponent() {
    const dispatch = useDispatch();

    const loadingReducer = useSelector((state: RootState) => state.loading);

    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const formReducer = useSelector((state: RootState) => state.form);
    const isShow = formReducer.reportType === ReportType.DEVICELOCATION;
    const center = {
        lat: formReducer.lat,
        lng: formReducer.lng,
    }


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
            const { latitude, longitude } = position.coords;

            dispatch(updateFormData({ key: "lat", data: latitude }));
            dispatch(updateFormData({ key: "lng", data: longitude }));
        });
    }

    /// ERROR COMPONENT
    if (isError) return <div
        className="text-[14px] w-full h-[20vh] grid place-items-center text-red-500">{errorMsg}</div>;

    return <motion.div
        className="flex h-fit flex-col gap-[.5rem] w-full overflow-hidden rounded-[8px] "
        animate={{
            height: isShow ? "25vh" : "0",
        }}
        transition={{
            duration: 0.3,
            ease: "linear",
        }}
    >
        {/** MAP CONTAINER */}
        {<AnimatePresence>
            {isShow && <motion.div className="h-full w-full"

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
                    delay: .3
                }}
            >
                <MapTile data={center} />
            </motion.div>}
        </AnimatePresence>}
    </motion.div>
}


