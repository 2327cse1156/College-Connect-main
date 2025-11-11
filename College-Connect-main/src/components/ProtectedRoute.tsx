import React from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children : React.ReactNode;
    adminOnly?:boolean;
}

const ProtectedRoute = ({children,adminOnly=false}:ProtectedRouteProps)=> {
    const {currentUser,loading} = useAuth();

    if(loading)
    {
        return (
            <div className='min-h-screen items-center justify-center flex'>
                <div className='text-xl'>
                    Loading...
                </div>
            </div>
        )
    }

    if(!currentUser){
        return <Navigate to="/login" replace/>;
    }

    if(adminOnly && currentUser.role !== "admin" && !currentUser.isAdmin)
    {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>
}

export default ProtectedRoute
