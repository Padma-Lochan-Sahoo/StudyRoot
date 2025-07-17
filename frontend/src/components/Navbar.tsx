import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import UserDropdown from "@/components/UserDropdown";

interface NavbarProps {
  userName: string;
}

const Navbar = ({ userName }: NavbarProps) => {
  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-2 rounded-xl">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
              StudyRoot
            </span>
          </Link>
          <UserDropdown userName={userName} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
