
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ChevronRight, Home, Calendar } from "lucide-react";
import UserDropdown from "@/components/UserDropdown";
import Navbar from "@/components/Navbar"; 
import { useAuthStore } from "@/store/useAuthStore";

const CourseView = () => {
  const { course } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();


  const getCourseName = (courseId: string) => {
    const courseNames: Record<string, string> = {
      'btech': 'B.Tech',
      'mca': 'MCA',
      'bca': 'BCA',
      'mba': 'MBA',
      'others': 'Others'
    };
    return courseNames[courseId] || courseId;
  };

  const getSemesters = (courseId: string) => {
    const semesterData: Record<string, { number: number; subjects: number }[]> = {
      'mba': [
        { number: 1, subjects: 6 },
        { number: 2, subjects: 6 },
        { number: 3, subjects: 5 },
        { number: 4, subjects: 4 }
      ],
      'btech': [
        { number: 1, subjects: 4 },
        { number: 2, subjects: 4 },
        { number: 3, subjects: 4 },
        { number: 4, subjects: 5 },
        { number: 5, subjects: 6 },
        { number: 6, subjects: 6 },
        { number: 7, subjects: 5 },
        { number: 8, subjects: 4 }
      ]
    };

    return semesterData[courseId] || Array.from({ length: 8 }, (_, i) => ({ 
      number: i + 1, 
      subjects: Math.floor(Math.random() * 3) + 4 
    }));
  };

  const semesters = getSemesters(course || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50">
      {/* Navigation */}
      <Navbar userName={authUser?.fullName || "Guest"} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/dashboard" className="flex items-center hover:text-uninote-blue transition-colors">
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-800">{getCourseName(course || '')}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {getCourseName(course || '')}{" "}
            <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
              Semesters
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a semester to access subject-wise notes and study materials.
          </p>
        </div>

        {/* Semester Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {semesters.map((semesterData) => (
            <Card 
              key={semesterData.number}
              className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-4px] cursor-pointer"
              onClick={() => navigate(`/dashboard/${course}/${semesterData.number}`)}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-uninote-blue to-uninote-purple flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-uninote-blue transition-colors">
                  Semester {semesterData.number}
                </CardTitle>
                <div className="text-sm text-gray-500 mt-2">
                  Total Subjects: {semesterData.subjects}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="w-full bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white font-medium rounded-xl transition-all duration-300"
                >
                  View Subjects
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
