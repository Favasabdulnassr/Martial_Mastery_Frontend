import HomePage from './Pages/UserSide/HomePage'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AdminRoute from './Routes/AdminRoute'
import StudentRoutes from './Routes/StudentRoutes'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setupAxiosInterceptors } from './services/interceptor'
import TutorRoute from './Routes/TutorRoute'





function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    // Call the setup function with dispatch so that it can be used in the interceptors
    setupAxiosInterceptors(dispatch);
  }, [dispatch]);


  return (
    <>
      <Router>
          <Routes>
            <Route path = '/' element={<HomePage/>}/>
            <Route path = 'tutor/*' element={<TutorRoute/>}/>
            <Route path='/*' element={<StudentRoutes/>} />
            <Route path='admin/*' element={<AdminRoute/>}/>
            
          </Routes>


       
      </Router>
    </>
  )
}

export default App
