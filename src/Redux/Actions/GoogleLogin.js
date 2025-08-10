import { BASE_URL } from "@/services/constents";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const handleGoogleSuccess = createAsyncThunk(
    'login/google',
    async(response,{rejectWithValue}) =>{

        try {
            const {code} = response;
            
            const backend_response = await axios.post(
                `${BASE_URL}/auth/google/login/`,
                {"token":code}
            )

            const tokens = {
                access :backend_response.data.access,
                refresh: backend_response.data.refresh
            };
            

            localStorage.setItem('authTokens',JSON.stringify(tokens));
            return backend_response.data

            
        } catch (error) {

            console.error(error,'ssssssuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuui')
            return rejectWithValue(error?.message || 'something went wrong');
            
        }

    }

)