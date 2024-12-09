import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


const AdminPrivateRoute = () =>{
    const {role} = useSelector((state)=>state.login)

    if(role !== null){
        if(role ==='admin'){
            return <Outlet/>
        }else{
            return <Navigate to="/login" replace />
        }

    }else{
        return <Navigate to="/login" replace />

    }

}

export default AdminPrivateRoute