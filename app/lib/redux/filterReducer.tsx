import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import FilterProps from "../models/FiltersModel";



const initialData = {
    isTabOpen: false,
    filter: {} as any,
}


const filterReducer = createSlice({
    initialState: initialData,
    name: "filter",
    reducers: {
        toggleFilterTab: (state) => {
            state.isTabOpen = !state.isTabOpen;
        },

        setFilter: (state, action: PayloadAction<any>) => {
            state.filter = action.payload;
        },

        removeFilter: (state, action: PayloadAction<string>) => {
            delete state.filter[action.payload];
        }
    }
})


export const { toggleFilterTab, setFilter, removeFilter } = filterReducer.actions;
export default filterReducer.reducer;