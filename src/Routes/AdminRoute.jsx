import React from "react";
import AdminPrivateRoute from "./PrivateRoutes/AdminPrivateRoute";
import { SidebarProvider } from "@/Components/SidebarProvider";
import {Route, Routes } from 'react-router-dom'
import AdminDashboard from "@/Pages/Adminside/AdminDashboard";
import StudentDetails from "@/Pages/Adminside/StudentDetail";
import TutorDetails from "@/Pages/Adminside/TutorDetail";
import AdminCourses from "@/Pages/Adminside/AdminCourses";
import Demo from "@/Pages/Adminside/demo";
import AdminCourseDetail from "@/Pages/Adminside/AdminCourseDetail";
import AdminReports from "@/Pages/Adminside/AdminReports";
import AdminReportedDetails from "@/Pages/Adminside/AdminReportedDetails";



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
            <Route path='/courseDetails/:courseId' element={<AdminCourseDetail/>}/>
            <Route path='/reports' element={<AdminReports/>}/>
            <Route path='/reports-details/:courseId' element={<AdminReportedDetails/>}/>
           
            






        </Route>
    </Routes>
    </SidebarProvider>
    )
}


export default AdminRoute
