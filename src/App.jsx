import HomePage from './Pages/UserSide/HomePage'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AdminRoute from './Routes/AdminRoute'
import StudentRoutes from './Routes/StudentRoutes'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setupAxiosInterceptors } from './services/interceptor'
import TutorRoute from './Routes/TutorRoute'
import { SidebarProvider } from './Components/SidebarProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ForgotPassword from './Components/ForgotPassword'
import ResetPassword from './Components/ResetPassword'





function App() {
  const GoogleClientId = process.env.GOOGLE_CLIENT_ID
  console.log(GoogleClientId);
  
  const dispatch = useDispatch()

  useEffect(() => {
    // Call the setup function with dispatch so that it can be used in the interceptors
    setupAxiosInterceptors(dispatch);
  }, [dispatch]);


  return (
    <>
    <GoogleOAuthProvider
     clientId={GoogleClientId}
     

     
     >
      <Router>
          <Routes>

            <Route path='/ResetPassword/:token' element={<ResetPassword/>} />
            <Route path='/forgotPassword' element={<ForgotPassword/>}/>
            <Route path = '/' element={<HomePage/>}/>
            <Route path = 'tutor/*' element={<TutorRoute/>}/>
            <Route path='/*' element={<StudentRoutes/>} />
            <Route path='admin/*' element={<AdminRoute/>}/>
            
          </Routes>

        <SidebarProvider>
          <Routes>



          </Routes>
          </SidebarProvider>


       
      </Router>


      </GoogleOAuthProvider>
    </>
  )
}

export default App
