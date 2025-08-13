import { setToken } from "@/utils/authService";
import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginAction = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/users/sign-in', { email, password });
            const { token, message } = res.data;
            setToken(token);
            return { token, message};
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data.message || 'Login failed');
        }
    }
);

export const signUpAction = createAsyncThunk(
    'auth/signupUser',
    async ({ name, email, password }: { name: string; email: string; password: string }, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/users/sign-up', { name, email, password });
            const { token, message } = res.data;
            setToken(token);
            return { token, message };
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response.data.message || 'Signup failed');
        }
    }
);

export interface ThumbnailJobResponse {
    message: string;
    jobs: {
      jobId: string;
      originalFilePath: string;
      originalFileName: string;
      thumbnailUrl: string;
      status: "queued" | "processing" | "completed" | "failed";
      type: "image" | "video";
    }[];
}

export const uploadFileAction = createAsyncThunk<
  ThumbnailJobResponse,
  FormData
>(
  'auth/uploadFile',
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/api/jobs/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data as ThumbnailJobResponse;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || 'Upload failed'
      );
    }
  }
);

