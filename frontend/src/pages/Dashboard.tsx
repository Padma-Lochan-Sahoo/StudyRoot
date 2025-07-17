
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, LogOut, User, BookOpen, Code, Building, Briefcase, MoreHorizontal } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import Navbar from "@/components/Navbar"; 
import { useAuthStore } from "@/store/useAuthStore";

const courses = [
  {
    id: "btech",
    title: "B.Tech",
    fullForm: "Bachelor of Technology",
    description: "Engineering courses",
    semesters: 8,
    icon: Code,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "mca",
    title: "MCA",
    fullForm: "Master of Computer Applications",
    description: "Computer Applications",
    semesters: 4,
    icon: BookOpen,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "bca",
    title: "BCA",
    fullForm: "Bachelor of Computer Applications",
    description: "Computer Applications",
    semesters: 6,
    icon: Building,
    color: "from-green-500 to-teal-500"
  },
  {
    id: "mba",
    title: "MBA",
    fullForm: "Master of Business Administration",
    description: "Business Administration",
    semesters: 4,
    icon: Briefcase,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "others",
    title: "Others",
    fullForm: "Additional Courses",
    description: "Additional programs",
    semesters: 6,
    icon: MoreHorizontal,
    color: "from-gray-500 to-slate-500"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50">
      {/* Navigation */}
      <Navbar userName={authUser?.fullName || "Guest"} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Your{" "}
            <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
              Study Hub
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your course to access semester-wise notes and study materials. 
            Everything you need for academic success, organized and ready to download.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const IconComponent = course.icon;
            return (
              <Card 
                key={course.id}
                className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onClick={() => navigate(`/dashboard/${course.id}`)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${course.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-uninote-blue transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    {course.fullForm}
                  </CardDescription>
                  <div className="text-sm text-gray-500 mt-2">
                    {course.semesters} Semesters
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    className="w-full bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white font-medium rounded-xl transition-all duration-300"
                  >
                    View Semesters
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <StatsCard />
      </div>
    </div>
  );
};

export default Dashboard;