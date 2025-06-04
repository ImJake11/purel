import { AppDispatch } from "../redux/store";
import { ReportModel } from "../models/ReportModel";
import { toggleOff, toggleOn, toggleSuccessMessage } from "../redux/loadingReducer";
import { addErrorReport, setInitialData, toggleReportProgress, updateFinalizingStatus, updateImageStatus, updateReportStatus } from "../redux/reportProgressReducer";
import ProgressType from "../enum/ProgressType";
import { resetData } from "../redux/formReducer";


class ReportingServices {
    private dispatch: AppDispatch;
    private data: ReportModel;
    private error: number;

    constructor(dispath: AppDispatch, data: ReportModel, error: number) {
        this.dispatch = dispath;
        this.data = data;
        this.error = error;
    }


    /// return true if it is success so front end will reset the users selected data
    async submitReport(): Promise<boolean> {

        this.dispatch(setInitialData(this.data.images.length));
        this.dispatch(toggleReportProgress());

        const id = await this.saveToDatabase();

        if (!id) {
            this.dispatch(addErrorReport("Report submission failed"));
            return false;
        }

        await this.uploadImagesToFirebase(id);


        ///// IF ERROR LENGTH IS MORE THAN 0 MEANS ERROR OCCURS WHILE PUBLISHING THE REPORT
        const hasError = this.error <= 0;

        if (hasError) {
            setTimeout(() => {
                this.dispatch(toggleReportProgress());
            }, 2000);
        }

        return true;
    }

    /// save data to database
    async saveToDatabase(): Promise<string | null> {

        this.dispatch(updateReportStatus(ProgressType.PROCESSING));

        const data = this.data;

        console.log(JSON.stringify({
            reporttype: data.reportType,
            description: data.description,
            lat: Number(data.lat),
            lng: Number(data.lng),
            type: Number(data.animalType),
            status: Number(data.status),
            contact: data.contact,
            landmark: data.landmark,
            images: [],
        }));

        const request = await fetch("/api/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reporttype: data.reportType,
                description: data.description,
                lat: Number(data.lat),
                lng: Number(data.lng),
                type: Number(data.animalType),
                status: Number(data.status),
                contact: data.contact,
                landmark: data.landmark,
                images: [],
            })
        });

        if (!request.ok) {
            this.dispatch(addErrorReport("Failed to upload Report"));
            return null;
        }

        const { id } = await request.json();

        console.log(id);

        this.dispatch(updateReportStatus(ProgressType.FINISHED));

        return id;;
    }


    /// upload image to firebase 
    async uploadImagesToFirebase(reportID: string) {

        const images: string[] = this.data.images;
        const imagesURL: string[] = [];

        for (let i = 0; i < images.length; i++) {

            this.dispatch(updateImageStatus({ index: i, status: ProgressType.PROCESSING }));

            const request = await fetch("/api/firebase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: images[i],
                    reportid: reportID,
                })
            })

            if (!request.ok) {
                this.dispatch(addErrorReport(`Failed to upload image ${i}, Server error`));
                this.dispatch(updateImageStatus({ index: i, status: ProgressType.ERROR }))
                continue;
            } else {
                const { url } = await request.json();
                imagesURL.push(url);
                this.dispatch(updateImageStatus({ index: i, status: ProgressType.FINISHED }));
            }


        }


        //// ONCE ALL IMAGES IS UPLOADED UPLOAD IT TO DATABASE AGAIN 
        this.dispatch(updateFinalizingStatus(ProgressType.PROCESSING));

        const request = await fetch("/api/report", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reportID: reportID,
                imageURL: imagesURL,
            })
        });

        if (!request.ok) {
            this.dispatch(addErrorReport("Failed to finalize report"))
            this.dispatch(updateFinalizingStatus(ProgressType.ERROR));
            return;
        }

        this.dispatch(updateFinalizingStatus(ProgressType.FINISHED));
    }
}


export default ReportingServices;