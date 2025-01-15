import React from "react";
import StudentPrivateRoutes from "./PrivateRoutes/StudentPrivateRoute";
import LoginPage from "@/Pages/UserSide/Studentlogin";
import SignupPage from "@/Pages/UserSide/StudentRegister";
import OTPVerificationPage from "@/Pages/UserSide/Otp";
import ContactPage from "@/Pages/UserSide/ContactPage";
import AboutUs from "@/Pages/UserSide/AboutUs";
import ProfilePage from "@/Pages/UserSide/Profile";
import {Route, Routes } from 'react-router-dom'
import CoursesPage from "@/Pages/UserSide/Courses";
import TutorialVideoList from "@/Pages/UserSide/TutorialVideoList";
import PurchasedCoursesPage from "@/Pages/UserSide/PurchasedCourses";


const StudentRoutes = () =>{

    return(

    <Routes>
         <Route path = '/login' element={<LoginPage/>} />
         <Route path = '/signup' element={<SignupPage/>} />
         <Route path = '/otp' element={<OTPVerificationPage/>}/>
         <Route path='/contact' element={<ContactPage/>} />
         <Route path='/about' element={<AboutUs/>} />



        <Route element={<StudentPrivateRoutes/>}>
            <Route path="/tutorials/:tutorialId/list" element={<TutorialVideoList/>}/>
            <Route path="/purchased-courses" element={<PurchasedCoursesPage/>}/>


            <Route path = '/profile' element={<ProfilePage/>}/>
            <Route path='/courses' element={<CoursesPage/>}/>

        </Route>

    </Routes>

    
    
    )
}

export default StudentRoutes

