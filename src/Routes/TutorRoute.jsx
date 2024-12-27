import { SidebarProvider } from '@/Components/SidebarProvider'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TutorPrivateRoute from './PrivateRoutes/TutorPrivateRoute'
import TutorRegistrationPage from '@/Pages/TutorSide/TutorRegister'
import TutorProfilePage from '@/Pages/TutorSide/TutorProfile'
import TutorStudents from '@/Pages/TutorSide/TutorStudents'
import TutorCourse from '@/Pages/TutorSide/AddTutorial'
import TutorTutorial from '@/Pages/TutorSide/MyTutorial'
import AddTutorial from '@/Pages/TutorSide/AddTutorial'
import AddVideo from '@/Pages/TutorSide/AddVideo'

function TutorRoute() {
    return (
        <SidebarProvider>
            <Routes>

                <Route path='/tutorRegister' element={<TutorRegistrationPage />} />

                <Route element={<TutorPrivateRoute />}>
                     <Route path='/tutorials' element={<TutorTutorial/>} />
                     <Route path='/tutorials/:tutorialId/addVideo' element={<AddVideo/>}/>


                    <Route path ='/AddTutorials' element={<AddTutorial />} />

                    <Route path='/students' element={<TutorStudents />} />
                    <Route path='/Profile' element={<TutorProfilePage />} />


                </Route>

            </Routes>
        </SidebarProvider>
    )
}

export default TutorRoute