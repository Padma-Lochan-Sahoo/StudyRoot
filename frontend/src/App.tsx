import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CourseView from "./pages/CourseView";
import SemesterView from "./pages/SemesterView";
import SubjectView from "./pages/SubjectView";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { Loader } from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./pages/Login"; // <- combine login/signup/verify-otp here

const queryClient = new QueryClient();

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const navigate = useNavigate();

  const DASHBOARD_ROLES = ["admin", "user"];
const ADMIN_ONLY = ["admin"];


  // Check auth when app mounts
  useEffect(() => {
    checkAuth();
  }, []);


  console.log({ authUser });



  // While checking auth, show loading screen
  if(isCheckingAuth && !authUser){
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
<Routes>
  <Route
  path="/"
  element={
    authUser ? (
      authUser.role === "admin" ? (
        <Navigate to="/admin" />
      ) : (
        <Navigate to="/dashboard" />
      )
    ) : (
      <Index />
    )
  }
/>

<Route
  path="/auth"
  element={
    authUser ? (
      authUser.role === "admin" ? (
        <Navigate to="/admin" />
      ) : (
        <Navigate to="/dashboard" />
      )
    ) : (
      <Login />
    )
  }
/>




  {/* Only for non-admin users */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute allowedRoles={DASHBOARD_ROLES}>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/dashboard/:course"
    element={
      <ProtectedRoute allowedRoles={DASHBOARD_ROLES}>
        <CourseView />
      </ProtectedRoute>
    }
  />
  <Route
    path="/dashboard/:course/:semester"
    element={
      <ProtectedRoute allowedRoles={DASHBOARD_ROLES}>
        <SemesterView />
      </ProtectedRoute>
    }
  />
  <Route
    path="/dashboard/:course/:semester/:subject"
    element={
      <ProtectedRoute allowedRoles={DASHBOARD_ROLES}>
        <SubjectView />
      </ProtectedRoute>
    }
  />

  {/* Only for admins */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute allowedRoles={ADMIN_ONLY}>
        <AdminPanel />
      </ProtectedRoute>
    }
  />

  <Route path="*" element={<NotFound />} />
</Routes>

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
