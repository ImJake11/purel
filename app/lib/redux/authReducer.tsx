import { createSlice, PayloadAction } from "@reduxjs/toolkit"




const initialData = {
    code: "",
    timeExpiredAt: "",
    isVerifying: false,
}


const authReducer = createSlice({
    name: "auth-reducer",
    initialState: initialData,
    reducers: {
        setCode: (state, actions: PayloadAction<string>) => {
            state.code = actions.payload;
        },

        setTimeExpiration: (state, actions: PayloadAction<string>) => {
            state.timeExpiredAt = actions.payload;
        },
        toggleVerifying: (state) => {
            state.isVerifying = !state.isVerifying;
        }
    }
})


export const { setCode, setTimeExpiration, toggleVerifying } = authReducer.actions;
export default authReducer.reducer;