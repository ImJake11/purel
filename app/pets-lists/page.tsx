"use client";

import "@/public/styles/petsList.css";
import Navbar from '@/app/lib/components/NavBar'
import React, { useEffect, useState } from 'react'
import PetModel from "@/app/lib/models/Pet";
import Link from "next/link";
import FilterTab from "./components/filter-tab/FilterTab";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../lib/redux/store";
import FilterTile from "./components/filter-tab/FilterTile";
import ItemTile from "./components/Itemtile";
import Sidebar from "../lib/components/Sidebar";
import CustomSearchbar from "./components/CustomSearchbar";


const page = () => {
    const filterReducer = useSelector((state: RootState) => state.filter);

    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [petData, setPetData] = useState<PetModel[]>([]);

    const handlePetsFetching = async () => {
        const response = await fetch("/api/pets", {
            method: "GET",
        });

        if (!response.ok) {
            setErrorMsg("Failed to fetch pets list, Try again later");
            setError(true);
            return;
        }


        const { pets } = await response.json();

        setPetData(pets);
        setIsLoading(false);
    }

    const handleFiltering = async () => {

        const filters = filterReducer.filter;

        setError(false);
        setIsLoading(true);


        const params = new URLSearchParams();

        if (filters.name) params.append("name", filters.name);
        if (filters.age) params.append("age", filters.age);
        if (filters.color) params.append("color", filters.color);
        if (filters.species) params.append("species", filters.species);
        if (filters.gender) params.append("gender", filters.gender);
        if (filters.rescued) params.append("rescued", filters.rescued);

        console.log(params.toString());


        const res = await fetch(`/api/pets/filter?${params.toString()}`, {
            method: "GET",
        });




        if (!res.ok) {
            const { error } = await res.json();
            setErrorMsg(error);
            setError(true);
            return;
        }


        const { data, message } = await res.json();

        console.log(message);
        setPetData(data);
        setIsLoading(false);
    }

    /// FETCH PETS LIST
    useEffect(() => {
        setIsLoading(true);
        handlePetsFetching();
        // Simulate fetching data

    }, []);


    useEffect(() => {
        if (Object.entries(filterReducer.filter).length !== 0) {
            handleFiltering();
        } else {
            handlePetsFetching();
        }
    }, [filterReducer.filter]);




    return (
        <div className='flex flex-col p-4 overflow-hidden h-screen w-screen relative'>
            <Navbar />
            <div className="w-full   text-[20px] p-[0_10px_10px_10px] flex flex-col gap-2 overflow-hidden">
                <span>Find a pet?</span>
                {/** SERARCH BAR */}
                <CustomSearchbar />
                {/** LISTED FILTER */}
                <div className="flex gap-1">
                    <AnimatePresence>
                        {Object.entries(filterReducer.filter).map(([k, v]) => <FilterTile key={k} label={k} data={v} />)}
                    </AnimatePresence>
                </div>
            </div>
            {/** pets list */}
            {isError ? <div className="flex-[1] bg-white grid place-content-center">
                <span className="text-red-500">{errorMsg}</span>
            </div> : <ul className="flex-[1] w-full overflow-y-auto flex flex-col gap-5">
                {isLoading ? <p className="place-self-center">Fetching pet list...</p> :
                    Array.from(petData).map((pet, i) => <Link href={`/pets-lists/${pet.id}`} key={pet.id}>
                        <ItemTile
                            data={pet}
                        />
                    </Link>)}
            </ul>}
            <FilterTab />
            <Sidebar />
        </div>
    )
}

export default page
