import { SidebarProvider } from '@/Components/SidebarProvider'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TutorPrivateRoute from './PrivateRoutes/TutorPrivateRoute'
import TutorRegistrationPage from '@/Pages/TutorSide/TutorRegister'
import TutorProfilePage from '@/Pages/TutorSide/TutorProfile'
import TutorStudents from '@/Pages/TutorSide/TutorStudents'
import TutorCourse from '@/Pages/TutorSide/TutorCourse'

function TutorRoute() {
    return (
        <SidebarProvider>
            <Routes>

                <Route path='/tutorRegister' element={<TutorRegistrationPage />} />

                <Route element={<TutorPrivateRoute />}>
                    <Route path='/courses' element={<TutorCourse />} />

                    <Route path='/students' element={<TutorStudents />} />
                    <Route path='/Profile' element={<TutorProfilePage />} />


                </Route>

            </Routes>
        </SidebarProvider>
    )
}

export default TutorRoute