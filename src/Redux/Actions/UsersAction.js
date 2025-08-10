import axiosInstance from "@/services/interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const FetchUsers = createAsyncThunk(
    'users/usersProfileAsync',    
    async({search = '',page = 1},{rejectWithValue}) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await axiosInstance.get(`/auth/users/?search=${search}&page=${page}`);


            return response.data

        }catch(error){
            return rejectWithValue(error?.message||'failed profile fetching');
        }
    }
)