import axiosInstance from "@/services/interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const FetchUsers = createAsyncThunk(
    'users/usersProfileAsync',    
    async({search = '',page = 1},{rejectWithValue}) => {
        try {
            const response = await axiosInstance.get(`/auth/users/?search=${search}&page=${page}`);

            console.log('fetch users',response.data)

            return response.data

        }catch(error){
            console.error('errerrrrerrrr',error)
            return rejectWithValue(error?.message||'failed profile fetching');
        }
    }
)