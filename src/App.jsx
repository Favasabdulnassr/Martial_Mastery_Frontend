import HomePage from './Pages/UserSide/HomePage'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ContactPage from './Pages/UserSide/ContactPage'
import AboutUs from './Pages/UserSide/AboutUs'
import Dashboard from './Pages/Adminside/AdminDashboard'
import { SidebarProvider } from './Components/SidebarProvider'

function App() {

  return (
    <>
      <Router>
        <div>
          <Routes>

            <Route path='/' element={<HomePage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/about' element={<AboutUs />} />
          </Routes>


          <SidebarProvider>
            <Routes>


              <Route path='/admin' element={<Dashboard />} />
            </Routes>

          </SidebarProvider>



        </div>
      </Router>
    </>
  )
}

export default App
