import { toggleFilterTab } from '@/app/lib/redux/filterReducer';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { useDispatch } from 'react-redux'

const CustomSearchbar = () => {

    const dispatch = useDispatch();
    return (
        <div className="relative flex w-full min-h-[2.5rem] border border-orange-300 rounded-[24px] box-border p-3"
            style={{
                boxShadow: "1px 1px 10px rgba(74, 85, 101, .6)"
            }}
        >
            <div className="flex-[1] flex items-center"
                onClick={() => dispatch(toggleFilterTab())}
            >
                <span className="text-[.8rem] text-gray-400">Search pet</span>
            </div>
            <FontAwesomeIcon icon={faSearch} className='text-orange-300' size={'1x'}
            />
        </div>
    )
}

export default CustomSearchbar
