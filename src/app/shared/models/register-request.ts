export interface RegisterRequest {
    email: string;
    password: string;
    direction: string;
    roles?: string[];
}
