import { clearToken } from '@/utils/authService';
import { createSlice } from '@reduxjs/toolkit';
import { loginAction, signUpAction, uploadFileAction } from '../action/auth.action';

interface AuthState {
    loading: string,
    message: string,
    alertType: string,
    apiName: string,
    isAuthenticated: boolean;
    jobs: any[];
}

const initialState: AuthState = {
    loading: "",
    message: "",
    alertType: "",
    apiName: "",
    isAuthenticated: !!localStorage.getItem('token'),
    jobs: [],
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.isAuthenticated = false;
            clearToken();
        },
        clearMessage(state) {
            state.message = "";
            state.alertType = "";
            state.apiName = "";
        },
    },
    extraReducers: builder => {
        builder
            // Login
            .addCase(loginAction.pending, state => {
                state.loading = "sign-in";
                state.apiName = "sign-in";
            })
            .addCase(loginAction.fulfilled, (state, action) => {
                state.loading = "";
                state.alertType = "success";
                state.message = action.payload.message;
                state.isAuthenticated = true;
            })
            .addCase(loginAction.rejected, (state, action) => {
                state.loading = "";
                state.alertType = "error";
                state.message = action.payload as string;
            })

            // Signup
            .addCase(signUpAction.pending, state => {
                state.loading = "sign-up";
                state.apiName = "sign-up";
            })
            .addCase(signUpAction.fulfilled, (state, action) => {
                state.loading = "";
                state.alertType = "success";
                state.message = action.payload.message;
                state.isAuthenticated = true;
            })
            .addCase(signUpAction.rejected, (state, action) => {
                state.loading = "";
                state.alertType = "error";
                state.message = action.payload as string;
            })

            // Upload File
            .addCase(uploadFileAction.pending, state => {
                state.loading = "upload-file";
            })
            .addCase(uploadFileAction.fulfilled, (state, action) => {
                state.loading = "";
                state.message = action.payload.message;
                if (action.payload && 'jobs' in action.payload) {
                    state.jobs = action.payload.jobs;
                }
            })
            .addCase(uploadFileAction.rejected, (state, action) => {
                state.loading = "";
                state.message = action.payload as string;
            })
    },
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;