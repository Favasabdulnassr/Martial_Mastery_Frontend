import { SidebarProvider } from '@/Components/SidebarProvider'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TutorPrivateRoute from './PrivateRoutes/TutorPrivateRoute'
import TutorRegistrationPage from '@/Pages/TutorSide/TutorRegister'
import TutorProfilePage from '@/Pages/TutorSide/TutorProfile'
import TutorStudents from '@/Pages/TutorSide/TutorStudents'
import TutorTutorial from '@/Pages/TutorSide/MyTutorial'
import AddVideo from '@/Pages/TutorSide/AddVideo'
import TutorWallet from '@/Pages/TutorSide/TutorWallet'
import CourseManagement from '@/Pages/TutorSide/CourseManagement'
import AddCourse from '@/Pages/TutorSide/AddCourse'
import PurchasedCourses from '@/Pages/TutorSide/UserPurchasedCourses'
import TutorVideoPage from '@/Pages/TutorSide/TutorVideoPage'
import TutorChat from '@/Pages/TutorSide/TutorChat'

function TutorRoute() {
    return (
        <SidebarProvider>
            <Routes>

                <Route path='/tutorRegister' element={<TutorRegistrationPage />} />

                <Route element={<TutorPrivateRoute />}>
                     <Route path='/tutorials' element={<TutorTutorial/>} />
                     <Route path='/courses/:CourseId/add-lesson' element={<AddVideo/>}/>
                     <Route path='/courseManagement' element={<CourseManagement/>} />
                    <Route path ='/add-course' element={<AddCourse />} />

                    <Route path='/students' element={<TutorStudents />} />
                    <Route path='/Profile' element={<TutorProfilePage />} />
                    <Route path='/wallet' element={<TutorWallet />} />
                    <Route path='/PurchasedCourse' element={<PurchasedCourses/>}/>
                    <Route path='/VideoPage/:tutorialId/:videoId' element={<TutorVideoPage/>}/>
                    <Route path='/chat/:studentId' element={<TutorChat/>}/>
                    <Route path='/wallet' element={<TutorWallet/>}/>





                </Route>

            </Routes>
        </SidebarProvider>
    )
}

export default TutorRoute