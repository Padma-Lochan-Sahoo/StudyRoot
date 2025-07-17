
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axiosInstance";
import { useAuthStore } from "@/store/useAuthStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserDropdownProps {
  userName: string;
  userImage?: string;
}

const UserDropdown = ({ userName, userImage }: UserDropdownProps) => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore(); // Get authUser from store

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authUser");
      navigate("/"); // send user back to login
    } catch (err: any) {
      console.error("Logout Error ❌", err.response?.data?.message || err.message);
      alert("Something went wrong while logging out.");
    }
  };

  const handleAdminRedirect = () => {
    navigate("/admin");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2 hover:bg-white/10">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-gradient-to-r from-uninote-blue to-uninote-purple text-white text-sm">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-gray-700 font-medium hidden sm:block">{userName}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border-white/20">
        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100/50">
          <User className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100/50">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        {/* Conditionally show Admin option */}
        {authUser?.role === "admin" && (
          <DropdownMenuItem
            onClick={handleAdminRedirect}
            className="flex items-center space-x-2 hover:bg-indigo-100 text-indigo-600"
          >
            <User className="h-4 w-4" />
            <span>Admin Panel</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-600 hover:bg-red-50/50"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export default UserDropdown;
