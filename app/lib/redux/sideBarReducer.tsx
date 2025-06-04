import { createSlice } from "@reduxjs/toolkit"




const initialState = {
    isOpen: false,
}


const sidebarReducer = createSlice({
    initialState: initialState,
    name: "sidebar",
    reducers: {
        toggleSidebar: (state) => {
            state.isOpen = !state.isOpen;
        }
    }
});


export const { toggleSidebar } = sidebarReducer.actions;
export default sidebarReducer.reducer;