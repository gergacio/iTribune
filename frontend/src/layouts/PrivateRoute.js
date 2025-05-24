import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.js";


const PrivateRoute = ({ children }) => { 
    const loggedIn = useAuthStore((state) => state.isLoggedIn)();

    return loggedIn ? <>{children}</> : <Navigate to="/login/" />;
}

export default PrivateRoute;

// wrapup studentDashboard route with private routes
// PrivateRoute
 // StudentDashBoard
//PrivateRoute