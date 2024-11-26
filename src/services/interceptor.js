import axios from "axios";
import { fetchNewAccessToken } from "./api/refresh";
import store from "@/Redux/store";
import { logout } from "@/Redux/LoginReducer";


const axiosInstance = axios.create({
    baseURL:"http://127.0.0.1:8000",

});







axiosInstance.interceptors.request.use(
    (config) =>{
        const tokens = JSON.parse(localStorage.getItem('authTokens'));
        const token = tokens?.access;
        console.log('toooooooooooooook',token)

    if (token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;

},
(error)=>{
    return Promise.reject(error)

}

);


axiosInstance.interceptors.response.use(
    (response) =>response,
    async(error) =>{
        const originalRequest = error.config;
        if(error.response.status == 401 && !originalRequest._retry){
            originalRequest._retry = true
            try {
                const response = await fetchNewAccessToken()
                const newAccessToken =  response.data
                console.log('newAcesssssssssToken',newAccessToken)
                const tokens = {access:newAccessToken.access,refresh:newAccessToken.refresh}
                localStorage.setItem("authTokens",JSON.stringify(tokens))


                return axiosInstance(originalRequest)

            
                
            } catch (error) {
                console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuui')

                console.log("Refresh token is invalid. Logging out...");
                store.dispatch(logout())
                

                
                return Promise.reject(refreshError)
                

                
            }

        }

        if ( error.response && error.response.status === 403) {
        }
        return Promise.reject(error)
    }
);


export default axiosInstance;