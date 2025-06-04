"use client";

import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import "remixicon/fonts/remixicon.css";
import { useSession } from 'next-auth/react';
import { toggleSidebar } from '../redux/sideBarReducer';

const UserAvatar = () => {

    const dispatch = useDispatch();
    const [userPhotoUrl, setPhotoUrl] = React.useState<string>("");
    const {data: session, status} = useSession();

    const handleClick = () => {
        dispatch(toggleSidebar());
    }


    useEffect(()=>{
        if(status === "authenticated" && session.user?.image){
            setPhotoUrl(session.user.image);
        }
    },[session, status]);


    return (
        <div className='w-[3rem] h-[3rem] bg-gray-300 rounded-full border-[var(--primary)] border-solid border-[2px] flex justify-center items-center overflow-hidden'
            onClick={handleClick}
        >
            {userPhotoUrl ? <img src={userPhotoUrl} alt='image'/> : <i className="ri-user-2-fill text-[2.8rem] text-white"></i>}
        </div>
    )
}

export default UserAvatar
