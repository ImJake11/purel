"use client";

import Link from "next/link";
import Logo from "./lib/components/Logo";
import LoadingIndicator from "./lib/components/LoadingIndicator";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toggleOff, toggleOn } from "./lib/redux/loadingReducer";
import { useRouter } from "next/navigation";


const paw = (
    <svg
        height="25px"
        width="25px"
        version="1.1"
        id="_x32_"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        fill="white"
    >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
            {" "}
            <style type="text/css"></style>
            {" "}
            <g>
                {" "}
                <path
                    d="M205.116,153.078c31.534,11.546,69.397-12.726,84.58-54.209c15.174-41.484,1.915-84.462-29.614-96.001 c-31.541-11.53-69.4,12.735-84.582,54.218C160.325,98.57,173.584,141.548,205.116,153.078z"></path>
                {" "}
                <path
                    d="M85.296,219.239c32.987-2.86,56.678-40.344,52.929-83.75c-3.757-43.391-33.545-76.253-66.532-73.409 c-32.984,2.869-56.674,40.36-52.921,83.759C22.53,189.23,52.313,222.091,85.296,219.239z"></path>
                {" "}
                <path
                    d="M342.196,217.768c28.952,17.017,70.552-0.073,92.926-38.154c22.374-38.106,17.041-82.758-11.915-99.774 c-28.951-17.001-70.56,0.097-92.93,38.178C307.905,156.117,313.245,200.768,342.196,217.768z"></path>
                {" "}
                <path
                    d="M497.259,262.912c-18.771-27.271-63.07-29.379-98.954-4.694c-35.892,24.701-49.762,66.822-30.996,94.101 c18.766,27.27,63.069,29.38,98.954,4.686C502.143,332.312,516.021,290.191,497.259,262.912z"></path>
                {" "}
                <path
                    d="M304.511,268.059c-3.58-24.773-18.766-47.366-43.039-58.824c-24.268-11.45-51.365-8.807-72.758,4.169 c-23.646,14.35-38.772,33.096-59.138,41.29c-20.363,8.193-77.4-16.209-112.912,48.278c-25.081,45.548-2.057,103.128,44.962,125.315 c35.738,16.864,64.023,14.981,84.788,24.774c20.762,9.793,37.29,32.83,73.025,49.692c47.018,22.188,106.1,3.362,125.315-44.957 c27.206-68.407-27.897-96.922-34.522-117.85C303.613,319.021,308.47,295.426,304.511,268.059z"></path>
                {" "}
            </g>
            {" "}
        </g>
    </svg>
);

export default function Home() {

    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const router = useRouter();



    useEffect(() => {
        const turnOffLoad = () => {
            setTimeout(() => {
                dispatch(toggleOff());
            }, 1000);
        }

        dispatch(toggleOn("Checking user account"));

        //// CHECK IF USER HAS SESSION DATA FROM OATH LOG IN
        if (session) {
            if (status === "authenticated") {
                router.push("/report-form");
            } else {
                turnOffLoad();
                return;
            }
        } else {

            const checkUserSession = async () => {
                const res = await fetch("/api/session", {
                    method: "GET",
                });


                if (!res.ok) {
                    turnOffLoad();
                    return;
                }


                const { session } = await res.json();

                if (session) {
                    router.push("/report-form");
                } else {
                    turnOffLoad();

                }

            }

            checkUserSession();
        }



    }, [status]);




    return (
        <div className="w-screen h-screen bg-white relative">
            <img
                src="/images/pets.webp"
                alt=""
                className="absolute bottom-0 blur-[3px]"
            />
            <div className="w-screen h-screen flex flex-col text-left p-[20px_40px] absolute gap-[30px]">

                {/** LOGO */}
                <Logo />
                <span className="text-4xl font-semibold ">
                    Help Save Stray And Abused{" "}
                    <span className="text-[var(--primary)]">Animals.</span>
                </span>

                {/** DETAILS */}
                <div className="w-full flex flex-col gap-20px text-gray-600 gap-[20px]">
                    <span className="text-[18px] font-[400]">
                        Report animals in need, and let rescuers find them faster
                    </span>
                    <span className="text-[18px] font-[400]">
                        Pin, Report, and Rescue - Together we can make a{" "}
                        <span className="text-[var(--primary)] font-semibold">difference</span>
                    </span>
                </div>
            </div>

            {/** button */}
            <Link href="/pages/signup-page">
                <button
                    className="report-button absolute bottom-[1rem] right-4 w-fit rounded-[30px] bg-[var(--primary)] flex items-center gap-[20px] p-[15px_15px] text-white place-self-end"

                    style={{
                        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.5)",
                    }}

                >
                    Report Now{paw}
                </button>
            </Link>
            <LoadingIndicator />
        </div>
    );
}
