"use client";

import React, { useEffect, useState } from 'react'
import "remixicon/fonts/remixicon.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw, faShieldCat, faVenusMars, faShieldDog, faFillDrip, faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PetModel from '@/app/lib/models/Pet';
import Image from 'next/image';


const PerProfilePage = () => {


    /// EXTRACT THE ID FROM THE URL
    const router = useRouter();
    const pathName = usePathname();
    const segments = pathName.split("/");
    const id = segments[segments.length - 1];


    const [petData, setPetData] = useState<PetModel>();
    const [error, setError] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    /// handle for fetching the pet data
    const handleDataFetch = async () => {

        const response = await fetch(`/api/pets/${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            setIsFetching(false);
            setError("Failed to fetch pet data. Please try again later.")
            return;
        }

        const { petData } = await response.json();
        setPetData(petData);
        setIsFetching(false);
    }


    /// FETCH THE PET DATA
    useEffect(() => {
        setIsFetching(true);
        handleDataFetch();
    }, []);


    if (isFetching) return <div className='w-screen h-screen grid place-content-center bg-gray-100'>
        <p>Fetching pet data....</p>
    </div>

    if (!petData || error != "") return <div className='w-screen h-screen grid place-content-center bg-gray-100'>
        <p>{error}</p>
    </div>


    return (
        <div className='w-screen h-screen flex flex-col bg-gray-100 overflow-hidden p-4 box-border'>
            <div className='flex gap-2.5 items-center'>
                <div className='w-[2.5rem] h-[2.5rem] bg-orange-300 rounded-full grid place-content-center'>
                    <i className="text-3xl ri-arrow-left-s-line text-white"
                        onClick={() => router.back()}
                    />
                </div>
                <span className='text-2xl fot-semibold'>{petData.name}'s Profile</span>
            </div>
            <div className='h-[10px]'></div>
            {/** PHOTO CONTAINCER */}
            <div className='relative w-full min-h-[250px] bg-gray-300 rounded-tr-[11px] rounded-tl-[11px] overflow-hidden'>
                <Image
                    alt='pet image'
                    src={petData.url}
                    fill
                    className='object-cover object-[0_20%]'

                />

                {/** AVAILABILITY BADGE */}
                <div className='absolute text-[.8rem] text-white bg-orange-300 rounded-[12px] p-1.5 right-1.5 top-1.5'>{petData.status}</div>
            </div>

            {/** details con */}
            <div className=' items-center flex-[1] w-full bg-white flex flex-col p-[15px_25px_15px_25px] rounded-br-[11px] rounded-bl-[11px] overflow-auto'>

                <span className='place-self-start text-orange-300'>Basic info</span>
                <div className='h-[1rem]'></div>
                <ul className='w-full  grid grid-cols-2 gap-2'>
                    <DetailTile data={petData.name} title='Name' icon={faPaw} />
                    <DetailTile data={petData.species} title='Species' icon={faShieldCat} />
                    <DetailTile data={petData.sex} title='Sex' icon={faVenusMars} />
                    <DetailTile data={petData.age} title='Age' icon={faShieldDog} />
                    <DetailTile data={petData.color} title='Color' icon={faFillDrip} />
                    <DetailTile data={petData.status} title='Status' icon={faNotesMedical} />
                </ul>

                <div className='min-h-[1.5rem]' />
                <div className='min-h-[1px] bg-gray-200 w-full'></div>
                <div className='min-h-[1.5rem]' />

                <span className='place-self-start text-orange-300'>Health</span>
                <div className='min-h-[1rem]'></div>
                <p className='place-self-start text-[.8rem]'>{petData.health}</p>


                <div className='min-h-[1.5rem]' />
                <div className='min-h-[1px] bg-gray-200 w-full'></div>
                <div className='min-h-[1.5rem]' />


                <span className='place-self-start text-orange-300'>Notes</span>
                <div className='min-h-[1rem]'></div>
                <p className='place-self-start text-[.8rem]'>{petData.notes}</p>



                <div className='min-h-[1.5rem]' />
                <div className='min-h-[1px] bg-gray-200 w-full'></div>
                <div className='min-h-[1.5rem]' />


                <span className='place-self-start text-orange-300'>History</span>
                <div className='min-h-[1rem]'></div>
                <span className='text-[.8rem] place-self-start'>Rescued at <span className='text-orange-300'>{petData.location}</span> at <span className='text-orange-300'>{formatData(petData.rescued)}</span>.</span>
                <div className='min-h-[1.8rem]' />



                {/** buttons */}
                <div className='grid w-full'>
                    <button className={`min-h-[3rem] rounded-[7px] ${petData.availability ? "bg-orange-300" : "bg-gray-300"} text-white p-[10px] place-self-end`}>File for adoption</button>
                </div>
                <div className='min-h-[1rem]' />
            </div>
        </div>
    )
}


const DetailTile = ({ title, data, icon }: { title: string, data: string, icon: IconProp }) => <div className='flex gap-2 text-[1rem] items-start w-full mt-[.6rem]'>
    {/** icon container */}
    <div className=' bg-gray-200 min-w-[3rem] h-[3rem] rounded-[20px] grid place-content-center'>
        <FontAwesomeIcon icon={icon} height={30} className='text-orange-300' />
    </div>
    <div className='flex flex-col'>
        <span className='font-[500]'>{title}</span>
        <span className='text-gray-500'>{data}</span>
    </div>
</div>



function formatData(isoString: string): string {

    const date = new Date(isoString);

    const formattedDate = date.toLocaleDateString('en-US', {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return formattedDate;
}

export default PerProfilePage;


