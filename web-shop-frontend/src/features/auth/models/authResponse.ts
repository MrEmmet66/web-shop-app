import { User } from "../../users/user";

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
}