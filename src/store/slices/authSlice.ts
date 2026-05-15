import { Plan } from "@/features/profile/api/hooks/usePlans";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserPlan extends Pick<Plan, "_id" | 'titleAr' | 'titleEn' | 'extraServicesDiscount' | 'insuranceDiscount' | 'reservationDiscount'> {
    expirationDate: string
    subscriptionDate: string
}
export interface User {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    IDFront: string;
    IDBack: string;
    gender?: "male" | "female";
    nationality?: string;
    image?: File | string | null;
    plan?: UserPlan
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; accessToken?: string; refreshToken?: string | null }>) => {
            localStorage.setItem('user', JSON.stringify(action.payload.user));

            if (action.payload.accessToken) {
                localStorage.setItem('accessToken', action.payload.accessToken);
            }
            if (action.payload.refreshToken) {
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            }

            state.user = action.payload.user;
            if (action.payload.accessToken)
                state.accessToken = action.payload.accessToken;

            state.refreshToken = action.payload.refreshToken ?? null;
        },
        clearCredentials: (state) => {
            ["user", "accessToken", "refreshToken"].forEach((key) => localStorage.removeItem(key));

            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.user = action.payload
        },
    },
});

export const { setCredentials, clearCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.accessToken;