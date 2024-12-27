import React from "react";
import AdminPrivateRoute from "./PrivateRoutes/AdminPrivateRoute";
import { SidebarProvider } from "@/Components/SidebarProvider";
import {Route, Routes } from 'react-router-dom'
import AdminDashboard from "@/Pages/Adminside/AdminDashboard";
import StudentDetails from "@/Pages/Adminside/StudentDetail";
import TutorDetails from "@/Pages/Adminside/TutorDetail";
import AdminCourses from "@/Pages/Adminside/AdminCourses";
import Demo from "@/Pages/Adminside/demo";


const AdminRoute = () =>{

    return(
    <SidebarProvider>
    <Routes>
        <Route  element={<AdminPrivateRoute/>}>
            <Route path='/dashboard' element={<AdminDashboard/>} />
            <Route path ='/students' element={<StudentDetails/>}/>
            <Route path ='/tutors' element = {<TutorDetails/>}/>
            <Route path = '/courses' element = {<AdminCourses/>}/>
            <Route path='/add' element={<Demo/>}/>


        </Route>
    </Routes>
    </SidebarProvider>
    )
}


export default AdminRoute
