import HomePage from './Pages/UserSide/HomePage'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ContactPage from './Pages/UserSide/ContactPage'
import AboutUs from './Pages/UserSide/AboutUs'
import Dashboard from './Pages/Adminside/AdminDashboard'
import { SidebarProvider } from './Components/SidebarProvider'
import StudentPage from './Pages/Adminside/StudentDetail'
import LoginPage from './Pages/UserSide/Studentlogin'
import SignupPage from './Pages/UserSide/StudentRegister'
import Profile from './Pages/UserSide/Profile'
import OTPVerificationPage from './Pages/UserSide/Otp'

function App() {

  return (
    <>
      <Router>
        <div>
          <Routes>

            <Route path='/' element={<HomePage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path = '/login' element={<LoginPage/>} />
            <Route path = '/signup' element={<SignupPage/>} />
            <Route path = '/profile' element={<Profile/>}/>
            <Route path = '/otp' element={<OTPVerificationPage/>}/>
          </Routes>


          <SidebarProvider>
            <Routes>


              <Route path='/admin' element={<Dashboard />} />
              <Route path ='/students' element={<StudentPage/>}/>
            </Routes>

          </SidebarProvider>



        </div>
      </Router>
    </>
  )
}

export default App
