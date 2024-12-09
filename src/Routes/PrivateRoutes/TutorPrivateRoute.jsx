import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'


const TutorPrivateRoute = () =>{
    const {role} = useSelector((state)=>state.login)

    if(role !== null){
        if(role ==='tutor'){
            return <Outlet/>
        }else{
            return <Navigate to="/login" replace />
        }

    }else{
        return <Navigate to="/login" replace />

    }

}

export default TutorPrivateRoute