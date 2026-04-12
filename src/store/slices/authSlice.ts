import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
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
        setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string | null }>) => {
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken!);
            localStorage.setItem('user', JSON.stringify(action.payload.user));

            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken ?? null;
        },
        clearCredentials: (state) => {
            ["user", "accessToken", "refreshToken"].forEach((key) => localStorage.removeItem(key));
            
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.accessToken;