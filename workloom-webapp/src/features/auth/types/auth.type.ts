import { BaseEntity } from "@/types";

export interface User extends BaseEntity {
    uuid: string;
    name: string;
    email: string;
}


export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse extends User {
    accessToken: string;
}

export interface RegisterResponse {
    message: string;
    data: User;
}