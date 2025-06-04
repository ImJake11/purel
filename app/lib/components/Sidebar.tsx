"user client";

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { signOut, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { RootState } from '../redux/store';
import { toggleOn } from '../redux/loadingReducer';
import { toggleSidebar } from '../redux/sideBarReducer';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBell, faHeart, faHeartCirclePlus, faRightFromBracket, faTableList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = () => {

    const dispatch = useDispatch();
    const sidebarHandler = useSelector((state: RootState) => state.sidebar);
    const { data: session, status } = useSession();
    const router = useRouter();

    const [username, setUsername] = useState("");

    const removeSession = async () => {
        await fetch("/api/session", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

    }

    const handleSignOut = async () => {

        dispatch(toggleOn("Signing out..."));

        if (session) {
            await signOut({ redirect: false });
            await removeSession();
            redirect("/login-page");
        } else {
            await removeSession();
            redirect("/login-page");
        }
    }



    //// FETCH USER NAME
    useEffect(() => {

        if (session) {
            if (session.user) {
                setUsername(session.user.name || "");
            }

        } else {

            const getUsername = async () => {
                const request = await fetch("/api/session", {
                    method: "GET",
                });

                if (!request.ok) {
                    return;
                }


                const { username } = await request.json();
                setUsername(username);
            }
            getUsername();
        }
    })


    /// COMPONENTS
    const ButtonTile = ({ name, link, icon }: { name: string, link: string, icon: IconProp }) => <motion.button
        className='w-[95%] h-[50px] rounded-[24px] text-[1rem] box-border pl-[20px] flex justify-between items-center text-white tracking-wide
        bg-linear-to-r from-orange-300 to-orange-500 pr-3
        '
        whileHover={{
            scale: 1.05,
            boxShadow: "1px 1px 6px rgba(74, 85, 101, .8)"
        }}
        onClick={() => router.push(link)}
    >

        <span>{name}</span>
        <FontAwesomeIcon icon={icon} />
    </motion.button>



    return (
        <AnimatePresence>

            {sidebarHandler.isOpen ? <motion.div
                className='w-screen h-screen absolute right-0 flex justify-end'
                style={{
                    backgroundColor: "rgb(72,72,72, .5)",
                }}

                animate={{
                    opacity: [0, 1]
                }}

                exit={{
                    opacity: 0,
                }}

                onClick={() => dispatch(toggleSidebar())}
            >
                <motion.div className='w-[300px] h-full bg-gray-100 box-border p-[10px] flex flex-col gap-1.5'

                    transition={{
                        delay: .5,
                    }}
                    animate={{
                        transform: ["translateX(100%)", "translateX(0)"]
                    }}

                    exit={{
                        transform: ["translateX(0)"]
                    }}
                >

                    {/** USER PROFILE */}
                    <div className='w-full flex justify-start gap-1.5 items-center'>
                        <div className="relative bg-gray-200 rounded-full h-[2.8rem] w-[2.8rem] box-border
                                        before:content-[''] before:absolute before:inset-[-0.15rem] before:z-[-1]
                                        before:rounded-full before:bg-gradient-to-r before:from-orange-300 before:to-orange-600"
                        >
                        </div>
                        <span className='flex-[1]'>{username}</span>

                        {/** ACTIVE INDICATOR */}
                        <div className='w-[.7rem] h-[.7rem] rounded-full bg-green-400'></div>
                    </div>

                    <div className='h-[40px]'></div>
                    {/** SIDEBAR MENU */}

                    <div className='flex-[1] items-center flex flex-col gap-2.5'>
                        {Array.from(buttonNames).map((name, i) =>
                            <ButtonTile key={i} name={name} link={links[i]} icon={icons[i]} />
                        )}
                    </div>


                    {/** LOG OUT BUTTON */}
                    <button className='w-full h-[3rem] rounded-[7px] border border-red400 text-red-400
                    flex gap-2 justify-center items-center
                    '
                        onClick={handleSignOut}
                    >
                        <span>Logout</span>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                    </button>

                </motion.div>

            </motion.div> : null
            }
        </AnimatePresence >
    )
}

export default Sidebar



const buttonNames: string[] = [
    "My Reports",
    "My Adoptions",
    "Adopt Pet",
    "Notifications",
]

const icons: IconProp[] = [
    faTableList,
    faHeart,
    faHeartCirclePlus,
    faBell,
];

const links: string[] = [
    "", "", "/pets-lists", "",
];