import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

import { Routes, Route, useNavigate } from "react-router-dom";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CourseView from "./pages/CourseView";
import SemesterView from "./pages/SemesterView";
import SubjectView from "./pages/SubjectView";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./pages/Login"; // <- combine login/signup/verify-otp here

const queryClient = new QueryClient();

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const navigate = useNavigate();

  // Check auth when app mounts
  useEffect(() => {
    checkAuth();
  }, []);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      navigate("/dashboard");
    }
  }, [isCheckingAuth, authUser, navigate]);

  // While checking auth, show loading screen
  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:course" element={<CourseView />} />
          <Route path="/dashboard/:course/:semester" element={<SemesterView />} />
          <Route path="/dashboard/:course/:semester/:subject" element={<SubjectView />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
