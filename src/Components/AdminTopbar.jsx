import { Bell, ChevronDown, LogOut, Menu, Search, Settings, X } from 'lucide-react'
import React,{useState} from 'react'
import { useSidebar } from './SidebarProvider';
import { useDispatch } from 'react-redux';
import { logout } from '@/Redux/Reducers/LoginReducer';

function AdminTopbar() {

  const [isProfileOpen, setProfileOpen] = useState(false);
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const dispatch = useDispatch()


  
  const handleLogout = ()=>{
    dispatch(logout())
    toast.success('Successfully logged out')
  }




  return (
    <>
     <nav className="sticky top-0 bg-white border-b border-gray-200 z-30 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <span className="text-xl font-bold text-gray-900">MartialMaster</span>
            </div>

            <div className="flex items-center space-x-4 ml-auto">
              {/* <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-4 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div> */}

              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 h-5 w-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                  3
                </span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-sm">JD</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-50 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
    </>
  )
}

export default AdminTopbar