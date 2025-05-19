import "@/app/styles/petsList.css";


import Navbar from '@/app/components/NavBar'
import React from 'react'


const searchbar: React.CSSProperties = {
    height: "50px",
    width: "auto",
    backgroundColor: "whitesmoke",
    border: "solid 1px var(--primary)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    padding: "8px",
    fontSize: "12px",
}

const page = () => {
    return (
        <div className='pets-list'>

            <Navbar />
            {/** SEARCH BAR */}
            <div className="w-screen h-fit bg-white text-[20px] p-[0_10px_10px_10px] flex flex-col gap-2">
                Find a pet?
                <div style={searchbar}>
                    <input type="text" name="search" id="search" placeholder="Search pet" className="flex-[1] focus:outline-none" />
                    <i className="ri-equalizer-3-fill text-3xl text-[var(--primary)]"></i>
                </div>
            </div>
            <div className="main-section">
                {Array.from({ length: 20 }).map((item, i) => <ItemTile key={i} />)}
            </div>

        </div>
    )
}


const ItemTile = () => <div className='item-tile'>
    <div className="item-tile-body">
        <div className="picture-con">
            <img src="https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?t=st=1746323184~exp=1746326784~hmac=87c0a5260746846fdf3e4eabe4d6e7e059b54c61e479a79c90680c81f75dab21&w=740" alt="img" />
        </div>
        <div className="details-con" >
            <div className="status-indicator">Adoption</div>
            <span>Mochi is a playful and affectionate pup who loves belly rubs, chasing butterflies, and napping in sunbeams. She’s friendly with everyone and always ready for a treat!</span>
            <span>Pet Name</span>
        </div>

    </div>
</div>
export default page
