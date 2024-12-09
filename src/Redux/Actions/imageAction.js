import axiosInstance from "@/services/interceptor";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const UploadImage = createAsyncThunk(
    'image/uploadImage',
    async(data,{rejectWithValue}) =>{
        try{
            const response = await axiosInstance.post('/auth/profile/profile_picture/',data);
            return response.data
        }catch(error){
            return rejectWithValue(error?.message||'porfile uploading failed')
        }
    }
)


export const DeleteImage = createAsyncThunk(
    'image/deleteImage',
    async(data,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.delete('/auth/profile/profile_picture/',data)
            return response.data
            
        } catch (error) {
            return rejectWithValue(error?.message||'profile deletion failed')
            
            
        }
    }

)