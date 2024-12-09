import axiosInstance from "@/services/interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const Fetchtutors = createAsyncThunk(
    'tutors/tutorsProfileAsync',
    async({search='',page=1},{rejectWithValue}) =>{
        try {
            const response = await axiosInstance.get(`/auth/tutors/?search=${search}&page=${page}`);
            return response.data
            
        } catch (error) {
            return rejectWithValue(error?.message||'failed Tutors Data Fetching')
        }

    }
)