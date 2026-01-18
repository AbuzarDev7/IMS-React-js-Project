import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase/firebase";

const ProtectedRoutes = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    console.log(" ProtectedRoutes: Checking auth state...");
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(" User is authenticated:", user.email);
        setIsAuthenticated(true);
        
        const storedRole = localStorage.getItem("userRole");
        // console.log(" Role from localStorage:", storedRole);
        
        setUserRole(storedRole?.toLowerCase());
      } else {
        console.log(" No user authenticated");
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    console.log("⏳ Loading auth state...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(" Not authenticated - Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (role && Array.isArray(role)) {
    const allowedRoles = role.map(r => r.toLowerCase());
    
    console.log(" Role Check:");
    console.log("   Required roles:", allowedRoles);
    console.log("   User role:", userRole);
    
    if (!allowedRoles.includes(userRole)) {
      console.log(" Access DENIED - Role mismatch");
      alert(`Access Denied! Your role: ${userRole}, Required: ${allowedRoles.join(' or ')}`);
      return <Navigate to="/login" replace />;
    }
    
    // console.log(" Access GRANTED");
  }

  return children;
};

export default ProtectedRoutes;