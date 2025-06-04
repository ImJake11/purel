import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import ProgressType from "../enum/ProgressType";

interface ImagesProps {
    index: number,
    status: string,
}


const initialData = {
    reportStatus: ProgressType.PENDING,
    imagesStatus: [] as ImagesProps[],
    isReportProgressOpen: false,
    error: [] as string[],
    finalizing: ProgressType.PENDING,
}

const reportProgressReducer = createSlice({
    initialState: initialData,
    name: "report progress",
    reducers: {
        toggleReportProgress: (state) => {
            state.isReportProgressOpen = !state.isReportProgressOpen;
        },
        setInitialData: (state, actions: PayloadAction<
            number
        >) => {


            /// SET THE IMAGES TO AN EMPTY ARRAY
            state.imagesStatus = [];
            state.reportStatus = ProgressType.PENDING;
            state.finalizing = ProgressType.PENDING;
            state.error = [];

            for (let i = 0; i < actions.payload; i++) {
                state.imagesStatus.push({
                    index: i,
                    status: ProgressType.PENDING,
                });
            }
        },

        updateReportStatus: (state, actions: PayloadAction<ProgressType>) => {
            state.reportStatus = actions.payload;
        },

        updateFinalizingStatus: (state, actions: PayloadAction<ProgressType>) => {
            state.finalizing = actions.payload;
        },

        updateImageStatus: (state, actions: PayloadAction<{
            index: number, status: ProgressType
        }>) => {
            const { index, status } = actions.payload;
            state.imagesStatus[index] = { index, status };
        },

        addErrorReport: (state, actions: PayloadAction<string>) => {

            const errorMsg = actions.payload;
            state.error.push(errorMsg);
        }

    }
})

export const { addErrorReport, updateFinalizingStatus, setInitialData, updateImageStatus, updateReportStatus, toggleReportProgress } = reportProgressReducer.actions;
export default reportProgressReducer.reducer;