import { ReportType } from "../enum/ReportType";

export interface ReportModel {
    reportType: ReportType,
    lat: number,
    lng: number,
    description: string,
    landmark: string,
    animalType: number,
    status: number, 
    images: string[],
    contact: string,
}