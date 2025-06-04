
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./formReducer";
import loadingReducer from "./loadingReducer";
import authReducer from "./authReducer";
import sidebar from "./sideBarReducer";
import filter from "./filterReducer";
import progress from "./reportProgressReducer";

const store = configureStore({

  reducer: {
    form: formReducer,
    loading: loadingReducer,
    auth: authReducer,
    sidebar: sidebar,
    filter: filter,
    progress: progress,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;