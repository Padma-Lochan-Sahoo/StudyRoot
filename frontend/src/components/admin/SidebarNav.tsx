// src/components/admin/SidebarNav.tsx

import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  LogOut,
  Upload,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SidebarNav = ({ activeTab, setActiveTab }: SidebarNavProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authUser");
      navigate("/");
    } catch (err: any) {
      console.error("Logout Error ❌", err.response?.data?.message || err.message);
      alert("Something went wrong while logging out.");
    }
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200/50">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-2 rounded-xl">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
            UniNote
          </span>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800 font-medium">🔒 Admin Panel</p>
          <p className="text-xs text-yellow-700 mt-1">Administrative access only</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("upload")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-uninote-blue to-uninote-purple text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Upload className="h-5 w-5" />
            <span>Upload Notes</span>
          </button>

          <button
            onClick={() => setActiveTab("manage")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "manage"
                ? "bg-gradient-to-r from-uninote-blue to-uninote-purple text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Manage Notes</span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarNav;
