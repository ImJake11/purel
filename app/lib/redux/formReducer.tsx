import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocationProps {
  lat: number,
  lng: number,
}


const initialState = {
  img: [] as string[],
  loc: {
    lat: 0,
    lng: 0,
  } as LocationProps,
  animalType: -1,
  status: -1,
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
    setLocation: (state, action: PayloadAction<{ lat: number, lng: number }>) => {
      state.loc = action.payload;
    }
    ,
    updateDropdowns: (state, action: PayloadAction<{ name: string, data: number }>) => {

      if (action.payload.name === "type") {
        state.animalType = action.payload.data;
      } else {
        state.status = action.payload.data;
      }
    },
    resetData: (state) => {
      state.animalType = -1;
      state.img = [] as string[];
      state.status = -1;
    }
  },
});

export const { setImages, removeImage, setLocation, updateDropdowns,resetData } = formReduce.actions;
export default formReduce.reducer;
