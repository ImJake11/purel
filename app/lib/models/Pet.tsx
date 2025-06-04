

export default interface PetModel {
    id: string;
    name: string;
    species: string;
    age: string;
    sex: string;
    color: string;
    rescued: string; // Date serialized as string from API
    location: string;
    health: string;
    url: string;
    notes: string;
    status: string;
    availability: boolean,
}