import { createSlice, PayloadAction } from "@reduxjs/toolkit"



const initialData = {
    isOpen: false,
    message: "",
    isSuccess: false,
    successMessage: "",
}

const loadingReducer = createSlice({
    initialState: initialData,
    name: "loading-reducer",
    reducers: {
        toggleOn: (state, action: PayloadAction<string>) => {
            state.isSuccess = false;
            state.message = action.payload;

            state.isOpen = true;
        },

        toggleOff: (state) => {
            state.message = "";
            state.isOpen = false;
            state.successMessage = "";
        },


        toggleSuccessMessage: (state, action: PayloadAction<string>)=> {
            state.successMessage = action.payload;
            state.isSuccess = true;
        },


    }
});


export const { toggleOff, toggleOn, toggleSuccessMessage} = loadingReducer.actions;
export default loadingReducer.reducer;