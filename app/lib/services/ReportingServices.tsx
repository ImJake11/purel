import { ref, uploadString } from "firebase/storage";
import { AppDispatch } from "../redux/store";
import { ReportModel } from "../models/ReportModel";
import { toggleOff, toggleOn, toggleSuccessMessage } from "../redux/loadingReducer";

interface DatabaseReport {
    id: string,
    isSuccess: boolean,
}

class ReportingServices {
    private dispatch: AppDispatch;
    private data: ReportModel;

    constructor(dispath: AppDispatch, data: ReportModel) {
        this.dispatch = dispath;
        this.data = data;
    }


    /// return true if it is success so front end will reset the users selected data
    async submitReport(): Promise<boolean> {

        this.dispatch(toggleOn("Submitting your report...."));


        try {
            const { id, isSuccess } = await this.saveToDatabase();

            if (!isSuccess) {
                return false;
            }

            await this.uploadImagesToFirebase(id);

            this.dispatch(toggleSuccessMessage("Your report is submitted"));

            setTimeout(() => {
                this.dispatch(toggleOff());
            }, 1000);

            return true;

        } catch (e) {
            this.dispatch(toggleOff());
            return false;
        }

    }

    /// save data to database
    async saveToDatabase(): Promise<DatabaseReport> {


        const data = this.data;
        const token = sessionStorage.getItem("session");

        const request = await fetch("/api/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                reporttype: data.reportType,
                description: data.description,
                lat: Number(data.lat),
                lng: Number(data.lng),
                type: Number(data.animalType),
                status:Number( data.status),
                contact: data.contact,
                landmark: data.landmark,
                images: [],
            })
        });

        if(!request.ok){
            console.log(token);
            console.log(await request.json())
            this.dispatch(toggleOff());
            return {
                id: "-1",
                isSuccess: false,
            }
        }

        const { id, success } = await request.json();

        return {
            id: id, isSuccess: success,
        }
    }


    /// upload image to firebase 
    async uploadImagesToFirebase(reportID: string) {

        console.log(`Uploading image: ${this.data.images.length}`);

        try {

            const images: string[] = this.data.images;

            for (const img of images) {
                const request = await fetch("/api/firebase", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        image: img,
                        reportid: "1",
                    })
                })

                if (!request.ok) {
                    console.log(`Error uploading this image ${img}`)
                    continue;
                }


            }

        } catch (e) {
            console.log("Error: Something went wrong uploading images to database");
            throw new Error("Error uploading to firebase");
        }
    }
}


export default ReportingServices;