import { CheckIcon } from '@/app/lib/components/icons/CheckIcon';
import FilterProps from '@/app/lib/models/FiltersModel';
import { setFilter, toggleFilterTab } from '@/app/lib/redux/filterReducer';
import { RootState } from '@/app/lib/redux/store';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DatePicker from './DatePicker';
import "remixicon/fonts/remixicon.css";



const inputStyle = `border-[1px] border-orange-300 rounded-[11px] min-h-[3rem] box-border p-2.5 mb-[1rem]`;
const dateInputStyles = "border-orange-300 border rounded-[7px] min-h-[3rem] w-[3rem] text-center";

const initialData = {
    name: "",
    species: "",
    age: "",
    color: "",
    gender: "both",
    month: "",
    year: "",
}

const FilterTab = () => {

    const dispatch = useDispatch();
    const filterReducer = useSelector((state: RootState) => state.filter);

    const [filtersData, setFiltersData] = useState<FilterProps>(initialData);
    const [showDatePicker, setShowDatePicker] = useState(false);


    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFiltersData({ ...filtersData, [name]: value });

    };



    const handleGender = (gender: string) => {
        setFiltersData({ ...filtersData, ["gender"]: gender });
    }




    const filters = useMemo(() => {

        const f: any = {};

        if (filtersData.name != "") {
            f.name = filtersData.name;
        }


        if (filtersData.age != "") {
            f.age = filtersData.age;
        }

        if (filtersData.color != "") {
            f.color = filtersData.color;
        }

        if (filtersData.species != "") {
            f.species = filtersData.species;
        }

        if (filtersData.month != "" && filtersData.year != "") {
            f.rescued = `${filtersData.month},${filtersData.year}`
        }

        f.gender = filtersData.gender;

        return f;

    }, [filtersData]);


    return (
        <AnimatePresence>
            {filterReducer.isTabOpen && <motion.div className=' inset-0 absolute'
                style={{
                    backgroundColor: "rgba(43, 42, 42, .5)"
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
            >
                <motion.div className='w-full h-[85%] bg-white absolute bottom-0 border-t-[1px] border-t-orange-300 flex flex-col p-7 overflow-auto'

                    initial={{
                        transform: "translateY(100%)",
                    }}

                    animate={{
                        transform: "translateY(0%)",
                    }}

                    transition={{
                        delay: .25,
                    }}
                >

                    <h1 className='mb-[1rem]'>What are you looking for? Let’s narrow it down — enter some filter info.</h1>

                    {/** list of current filter that user give*/}
                    <motion.div className='flex flex-wrap w-full gap-1'
                        layout
                    >
                        <AnimatePresence >
                            {Object.entries(filters).map(([k, v]) => <motion.div key={k} className='w-fit h-fit p-[7px] bg-linear-to-r from-orange-300 to-orange-400 rounded-[7px]'
                                layout
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
                                    type: "tween",
                                    duration: .25,
                                    ease: "easeInOut",
                                }}
                            >
                                <span className='text-white text-[.8rem]'>{k.toUpperCase()}</span>
                            </motion.div>)}
                        </AnimatePresence>
                    </motion.div>

                    <div className='min-h-[1.5rem]' />
                    <Title title='Name' />
                    <input type="text" name="name" placeholder='Search Pet name'
                        className={inputStyle}
                        style={{
                            boxShadow: "1px 1px 10px rgba(74, 85, 101, .6)"
                        }}
                        onChange={handleInput}
                    />

                    <Title title='Species' />
                    <input type="text" name="species" placeholder='eg. Dog, Cat'
                        className={inputStyle}
                        style={{
                            boxShadow: "1px 1px 10px rgba(74, 85, 101, .6)"
                        }}
                        onChange={handleInput}
                    />


                    <Title title='Age' />
                    <input type="text" name="age" placeholder='eg. Puppy, Kitten, Adult'
                        className={inputStyle}
                        style={{
                            boxShadow: "1px 1px 10px rgba(74, 85, 101, .6)"
                        }}
                        onChange={handleInput}
                    />


                    <Title title='Color' />
                    <input type="text" name="color" placeholder='eg. Brown, Black'
                        className={inputStyle}
                        style={{
                            boxShadow: "1px 1px 10px rgba(74, 85, 101, .6)"
                        }}
                        onChange={handleInput}
                    />


                    <Title title='Gender' />
                    <div className='flex w-full mb-[.5rem]'>
                        <CheckBox isSelected={filtersData.gender === "male"} label='Male' onClick={() => handleGender("male")} />
                        <CheckBox isSelected={filtersData.gender === "female"} label='Female' onClick={() => handleGender("female")} />
                        <CheckBox isSelected={filtersData.gender === "both"} label='Both' onClick={() => handleGender("both")} />
                    </div>


                    {/** months */}
                    <div className='min-h-[1rem]' />
                    <Title title='Month and Year Rescued' />
                    <div className='w-auto flex gap-2.5 mt-[.5rem]'>
                        {filtersData.month && filtersData.year && <div className='min-h-[2.5rem] w-[100px] border
                         border-gray-500 rounded-[7px] flex justify-evenly items-center text-[1.2rem] text-gray-500'>
                            <span>{filtersData.month}</span>
                            <span>/</span>
                            <span>{filtersData.year}</span>
                        </div>}
                        <button className='w-fit min-h-[2.5rem] bg-linear-to-r from-orange-300 to-orange-400 rounded-[7px] p-[0_10px_0_10px]
                         text-white flex gap-1 items-center'
                            style={{
                                boxShadow: "1px 1px 20px rgba(75, 85, 101, .4)"
                            }}
                            onClick={() => setShowDatePicker(true)}
                        >Pick date <i className="ri-calendar-fill"></i></button>
                    </div>

                    <div className='min-h-[2rem]' />

                    {/** BUTTONS */}
                    <div className='w-full flex gap-2 justify-end'>
                        <button type="submit"
                            className='w-fit h-fit p-[10px_15px_10px_15px] text-orange-300 rounded-[7px] border border-orange-300'
                            onClick={() => dispatch(toggleFilterTab())}
                        >Cancel</button>
                        <button type="submit"
                            className='w-fit h-fit p-[10px_15px_10px_15px] bg-linear-to-r from-orange-300 to-orange-400 rounded-[7px] text-white'
                            onClick={() => {
                                setFiltersData(initialData);
                                dispatch(setFilter(filters));
                                dispatch(toggleFilterTab());
                            }}
                        >Search Pet</button>
                    </div>
                    <div className='min-h-[.5rem]' />
                </motion.div>

                <AnimatePresence>
                    {showDatePicker && <DatePicker
                        month={filtersData.month}
                        year={filtersData.year}
                        onCancel={() => setShowDatePicker(false)}
                        onSave={(data) => {
                            const { month, year } = data;

                            setFiltersData(prev => ({
                                ...prev,
                                year,
                                month,
                            }));
                            setShowDatePicker(false);

                        }} />}
                </AnimatePresence>
            </motion.div>}
        </AnimatePresence>
    )
}


const Title = ({ title }: { title: string }) => <span className='mb-[.2rem] text-[.8rem] font-semiboold'>
    {title}</span>

const CheckBox = ({ isSelected, label, onClick }: { isSelected: boolean, label: string, onClick: () => void }) => <div className='flex-[1] flex gap-2 items-center'
    onClick={onClick}
>
    <div className={`w-[1.5rem] h-[1.5rem] border-[1px] border-orange-300 rounded-[3px] ${isSelected ? "bg-orange-300" : "bg-white"} grid place-content-center`}>
        {isSelected && CheckIcon()}
    </div>
    <span>{label}</span>
</div>


export default FilterTab
