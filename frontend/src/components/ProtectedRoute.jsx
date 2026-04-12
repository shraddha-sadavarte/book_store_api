import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

const protectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useAuth();

    if(!user) return <Navigate to="/login" replace />
    if(adminOnly && user.role !== 'Admin') return <Navigate to='/' replace/>

    return children
}

export default protectedRoute;