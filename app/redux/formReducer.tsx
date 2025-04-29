import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  img: [] as string[],
};

const formReduce = createSlice({
  name: "form-reducer",
  initialState: initialState,
  reducers: {
    setImages: (state, action: PayloadAction<string[]>) => {
      state.img = [...state.img, ...action.payload];
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.img.splice(action.payload, 1);
    },
  },
});

export const { setImages, removeImage } = formReduce.actions;
export default formReduce.reducer;
