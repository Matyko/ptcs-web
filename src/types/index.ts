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

export interface WithTimeStamp {
    createdAt: number;
    modifiedAt: number;
}

export interface Park extends WithTimeStamp {
    name: string;
    geoLocation: GeoData;
    address: string;
    active: boolean;
    photos: ParkPhoto[];
    id?: string;
    contributors: string[];
    description?: string;
}

export interface ParkRequest extends WithTimeStamp {
    park: Park;
    submitted: boolean;
    id?: string;
}

export interface ParkPhoto {
    url: string;
    name: string;
}

export interface ParkPhotoUpload extends ParkPhoto {
    task: object;
    progress: number;
}

export enum CollectionType {
    ParkRequests = 'park-requests',
    Parks = 'parks',
    Users = 'users',
}

export enum PathNames {
    Home = 'home',
    SignUp = 'sign-up',
    Login = 'log-in',
    About = 'about',
    Contact = 'contact',
    ParkEditor = 'park-editor',
    MyParks = 'my-parks',
    Events = 'events',
    Friends = 'friends',
    Groups = 'groups',
    Settings = 'settings',
    Messages = 'messages',
}
