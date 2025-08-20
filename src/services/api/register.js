import axios from "axios"
import { BASE_URL } from "../constents"



export const handleRegister = async (data) =>{
    try{
        const response = await axios.post(BASE_URL + '/auth/register/',data);
        return response.data;

    }catch(error){
        throw error
    }
};

export const handleTutorRegister = async (data) =>{
    try{
        const response = await axios.post(BASE_URL + '/auth/tutors/register/',data);
        return response.data;

    }catch(error){
        throw error
    }
};





