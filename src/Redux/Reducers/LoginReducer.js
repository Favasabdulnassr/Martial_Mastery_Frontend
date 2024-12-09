import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '@/services/constents'
import axios from 'axios'
import { updateProfileAsync } from '../Actions/UpdateAction';
import { DeleteImage, UploadImage } from '../Actions/imageAction';
import { act } from 'react';


const initialState = {
    first_name:null,
    last_name:null,
    image :null,
    loader:false,
    isAuthenticated:false,
    error:null,
    role:null,
    email:null,
    is_tutor:false,
    phone_number:null

};

export const loginAsync = createAsyncThunk(
    'login/loginAsync',
    async(loginData,{rejectWithValue})=>{
        try{
            console.log('aaaaaaaaa')
            const response = await axios.post(`${BASE_URL}/auth/token/`,loginData);
            console.log('Token received:', response.data);

            const token = response.data;

            const tokens = { access: token.access, refresh: token.refresh };
            localStorage.setItem('authTokens', JSON.stringify(tokens));
            localStorage.setItem('authTokens', JSON.stringify(tokens));
            localStorage.setItem('authTokens', JSON.stringify(tokens));
            console.log('Tokens stored in localStorage:', tokens);

            // Decode the JWT token
            const decodeToken = JSON.parse(atob(token.access.split('.')[1]));
            console.log('Decoded Token Payload:', decodeToken);

            const {role,email,first_name,phone_number,last_name,profile } = decodeToken;
            console.log('is_superuser:aaaaaaaaaaaayesffffffffffffffff9y',role,email);

            // Return required details
            return { role,email,first_name,phone_number,last_name,profile};
        }catch(error){
            console.error(error,'ssssssuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuui')
            return rejectWithValue(error?.message || 'something went wrong');

        }
    }
)

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers:{
       
        logout(state,action){
            state.first_name = null,
            state.last_name = null,
            state.loader = false;
            state.isAuthenticated = false;
            state.error  = null
            state.role = null
            state.email = null;
            state.phone_number = null;
            state.profile = null,
            localStorage.removeItem('authTokens');
        },
    },
    extraReducers: (builder) =>{
        builder
        .addCase(loginAsync.pending,(state)=>{
            state.loader = true
        })
        .addCase(loginAsync.fulfilled,(state,action)=>{
            state.loader = false;
            state.isAuthenticated = true;
            state.profile = action.payload.profile
            state.error = null;
            state.role = action.payload.role;
            state.phone_number = action.payload.phone_number
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.email = action.payload.email

        })
        .addCase(loginAsync.rejected,(state,action)=>{
            state.loader = false;
            state.isAuthenticated = false
            state.error = action.payload || 'something went wrong';
            state.role = null
            state.phone_number = null
            state.first_name = null
            state.last_name = null
            state.email = null
            state.image = null
        })
        .addCase(updateProfileAsync.pending,(state)=>{
            state.loader = true
        })
        .addCase(updateProfileAsync.fulfilled,(state,action)=>{
            state.loader = false
            state.first_name = action.payload.first_name || state.first_name,
            state.last_name = action.payload.last_name || state.last_name
            state.email = action.payload.email || state.email
            state.phone_number = action.payload.phone_number || state.phone_number
            state.role = action.payload.role || state.role   
            state.profile = action.payload.profile || state.profile
        })
        .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loader = false;
        state.error = action.payload || 'Profile update failed';
        })
        .addCase(UploadImage.pending,(state)=>{
            state.loader = true;
        })
        .addCase(UploadImage.fulfilled,(state,action) =>{
            state.profile = action.payload.profile
            state.loader = null
            state.error = null
        })
        .addCase(UploadImage.rejected,(state,action) =>{
            state.error = action.payload || 'image uploading failed'
            state.loader = null
        })
        .addCase(DeleteImage.pending,(state)=>{
            state.loader = true;
        })
        .addCase(DeleteImage.fulfilled,(state,action) =>{
            state.profile = null
            state.loader = null
            state.error = null
        })
        .addCase(DeleteImage.rejected,(state,action) =>{
            state.error = action.payload || 'image uploading failed'
            state.loader = null
        })

    }
})


export const {logout} = loginSlice.actions
export default loginSlice.reducer