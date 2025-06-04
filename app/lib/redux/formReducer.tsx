import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReportType } from "../enum/ReportType";
import { ReportModel } from "../models/ReportModel";


const initialState: ReportModel = {
  reportType: ReportType.NONE,
  animalType: -1,
  status: -1,
  description: "",
  lat: 0.0,
  lng: 0.0,
  landmark: "",
  images: [],
  contact: "09",
};

const formReduce = createSlice({
  name: "form-reducer",
  initialState: initialState,
  reducers: {
    updateFormData: (state, actions: PayloadAction<{ key: string, data: any }>) => {
      const { key, data } = actions.payload;

      return { ...state, [key]: data };
    },
    resetData: () => initialState,
    addImage: (state, actions: PayloadAction<string>) => {
      state.images.push(actions.payload);
    },
    removeImage: (state, actions: PayloadAction<number>) => {
      state.images.splice(actions.payload, 1);
    }
  },
});

export const { updateFormData, resetData, addImage, removeImage } = formReduce.actions;
export default formReduce.reducer;
