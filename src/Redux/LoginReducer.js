import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import { BASE_URL } from '@/services/constents'
import axios from 'axios'
import Cookies from 'js-cookie'


const initialState = {
    first_name:null,
    loader:false,
    isAuthenticated:false,
    error:null,
    is_superuser:false,
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
            console.log('Tokens stored in localStorage:', tokens);

            // Decode the JWT token
            const decodeToken = JSON.parse(atob(token.access.split('.')[1]));
            console.log('Decoded Token Payload:', decodeToken);

            const { is_superuser,is_tutor,email,first_name,phone_number  } = decodeToken;
            console.log('is_superuser:aaaaaaaaaaaayesffffffffffffffff9y',is_superuser,is_tutor,email);

            // Return required details
            return { is_superuser,is_tutor,email,first_name,phone_number};
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
            state.loader = false;
            state.isAuthenticated = false;
            state.error  = null
            state.is_superuser = null
            state.is_tutor = null
            state.email = null;
            state.phone_number = null;
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
            state.error = null;
            state.is_superuser = action.payload.is_superuser;
            state.is_tutor = action.payload.is_tutor;
            state.phone_number = action.payload.phone_number
            state.first_name = action.payload.first_name
            state.email = action.payload.email

        })
        .addCase(loginAsync.rejected,(state,action)=>{
            state.loader = false;
            state.isAuthenticated = false
            state.error = action.payload || 'something went wrong';
            state.role = null
            state.is_superuser = false
            state.is_tutor = false
            state.phone_number = null
            state.first_name = null
            state.email = null
        })
    }
})


export const {logout} = loginSlice.actions
export default loginSlice.reducer