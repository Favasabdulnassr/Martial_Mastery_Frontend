import axios from "axios";
import { fetchNewAccessToken } from "./api/refresh";
import { logout } from "@/Redux/Reducers/LoginReducer";



const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

// Define a function to handle token refresh and logout
export const setupAxiosInterceptors = (dispatch) => {
  // Request Interceptor to add Authorization header
  axiosInstance.interceptors.request.use(
    (config) => {
      const tokens = JSON.parse(localStorage.getItem('authTokens'));
      const token = tokens?.access;
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor to handle token expiration
  axiosInstance.interceptors.response.use(
    (response) => {
        
      return response
    },
    
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
         
        try {
          // Fetch new access token
          const response = await fetchNewAccessToken();
          const newAccessToken = response.data;
          const tokens = { access: newAccessToken.access, refresh: newAccessToken.refresh };
          
          // Store the new tokens in localStorage
          localStorage.setItem("authTokens", JSON.stringify(tokens));

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } catch (error) {
          console.log("Refresh token is invalid. Logging out...",error);

          // If the refresh token is invalid, remove authTokens and dispatch logout

          // Dispatch the logout action
          dispatch(logout());  // Dispatch logout action to reset the state in Redux

          // Redirect user to login page or perform any additional logout actions
          // Optionally, you can use `navigate("/login")` to redirect the user
          // navigate('/login');

          return Promise.reject(error);
        }
      }

      if (error.response && error.response.status === 403) {
        // Handle forbidden errors (optional)
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;