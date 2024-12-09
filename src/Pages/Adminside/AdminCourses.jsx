import AdminSidebar from '@/Components/AdminSidebar'
import AdminTopbar from '@/Components/AdminTopbar'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function AdminCourses() {

  const {isAuthenticated,role} = useSelector((state)=> state.login)

  useEffect(()=>{
    if(role !== 'admin'){
        navigate('/')
    }
    
},[isAuthenticated,role])

  return (
    <>
        <div className="flex min-h-screen bg-gray-50">
          <AdminSidebar/>
          <div className='flex-1 lg:ml-80'>
          <AdminTopbar />


          Courses


          </div>


        </div> 


    </>
  )
}

export default AdminCourses