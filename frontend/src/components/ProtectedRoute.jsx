import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

const protectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if(loading){
        return <div className='flex justify-center items-center h-screen'>Loading...</div>
    }

    if(!user){
        return <Navigate to="/login" replace />
    } 
    
    if(adminOnly && user.role !== 'admin') return <Navigate to='/' replace/>

    return children
}

export default protectedRoute;