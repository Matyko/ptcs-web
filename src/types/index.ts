export interface User {
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    phone?: string;
    id: string;
}

export interface GeoData {
    lng: number | string;
    lat: number | string;
}

export interface Park {
    name: string;
    geoLocation: GeoData;
    address: string;
    active: boolean;
    photos: string[];
    id?: string;
    contributors: string[];
}
