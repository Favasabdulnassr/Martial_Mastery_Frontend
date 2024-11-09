import AdminSidebar from '@/Components/AdminSidebar'
import AdminTopbar from '@/Components/AdminTopbar'
import React, { useState } from 'react'

function AdminDashboard() {
  return (
    <>
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar/>
          <div className='flex-1 lg:ml-80'>
          <AdminTopbar />


          </div>


        </div> 


    </>
  )
}

export default AdminDashboard