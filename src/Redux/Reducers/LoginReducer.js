import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '@/services/constents'
import axios from 'axios'
import { updateProfileAsync } from '../Actions/UpdateAction';
import { DeleteImage, UploadImage } from '../Actions/imageAction';
import { act } from 'react';
import { handleGoogleSuccess } from '../Actions/GoogleLogin';


const initialState = {
    first_name:null,
    last_name:null,
    profile :null,
    loader:false,
    isAuthenticated:false,
    error:null,
    role:null,
    email:null,
    phone_number:null,
    bio:null,
    experience:null,
    user:null,
    google_login:null

};

export const loginAsync = createAsyncThunk(
    'login/loginAsync',
    async(loginData,{rejectWithValue})=>{
        try{
            const response = await axios.post(`${BASE_URL}/auth/token/`,loginData);

            const token = response.data;

            const tokens = { access: token.access, refresh: token.refresh };
            localStorage.setItem('authTokens', JSON.stringify(tokens));

            // Decode the JWT token
            const decodeToken = JSON.parse(atob(token.access.split('.')[1]));

            const {role,email,first_name,phone_number,last_name,profile,user_id,bio,experience } = decodeToken;

            // Return required details
            return { role,email,first_name,phone_number,last_name,profile,bio,user_id,experience};
        }catch(error){
            console.error('ssssssuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuui')
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
            state.user = null;
            state.phone_number = null;
            state.profile = null,
            state.bio = null,
            state.experience = null
            state.google_login = null
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
            state.bio = action.payload.bio
            state.experience = action.payload.experience
            state.user = {  // Store the whole user object here
                id: action.payload.user_id,

                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                role: action.payload.role,
                email: action.payload.email,
                phone_number: action.payload.phone_number,
                profile: action.payload.profile,
            };

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
            state.bio = action.payload.bio
            state.experience = action.payload.experience
        })
        .addCase(updateProfileAsync.pending,(state)=>{
            state.loader = true
        })
        .addCase(updateProfileAsync.fulfilled,(state,action)=>{
            state.loader = false
            state.first_name = action.payload.first_name || state.first_name,
            state.last_name = action.payload.last_name 
            state.email = action.payload.email || state.email
            state.phone_number = action.payload.phone_number || state.phone_number
            state.role = action.payload.role || state.role   
            state.profile = action.payload.profile || state.profile
            state.bio = action.payload.bio 
            state.google_login=null
            state.experience = action.payload.experience
            state.user = {  // Store the whole user object here
                id: action.payload.user_id,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                role: action.payload.role,
                email: action.payload.email,
                phone_number: action.payload.phone_number,
                profile: action.payload.profile,
            };
 
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
            state.google_login = null
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
            state.google_login = null
        })
        .addCase(DeleteImage.rejected,(state,action) =>{
            state.error = action.payload || 'image uploading failed'
            state.loader = null
        })
        .addCase(handleGoogleSuccess.pending,(state)=>{
            state.loader = true;

        })
        .addCase(handleGoogleSuccess.fulfilled,(state,action) =>{
            state.role = action.payload.role
            state.email = action.payload.email
            state.first_name = action.payload.first_name
            state.last_name = action.payload.last_name
            state.profile = action.payload.profile
            state.isAuthenticated = true;
            state.error = null
            state.loader = null
            state.google_login = true
            state.user = {  // Store the whole user object here
                id: action.payload.id,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                role: action.payload.role,
                email: action.payload.email,
                phone_number: action.payload.phone_number,
                profile: action.payload.profile,
                
            };

        })
        .addCase(handleGoogleSuccess.rejected,(state,action)=>{
            state.error = action.payload
            state.loader = null

        })

    }
})


export const {logout} = loginSlice.actions
export default loginSlice.reducer