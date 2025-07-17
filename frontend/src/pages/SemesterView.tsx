
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ChevronRight, Home, BookOpen } from "lucide-react";
import UserDropdown from "@/components/UserDropdown";
import Navbar from "@/components/Navbar"; 
import { useAuthStore } from "@/store/useAuthStore";

const SemesterView = () => {
  const { course, semester } = useParams();
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

  const getSubjects = (courseId: string, sem: string) => {
    const subjects: Record<string, Record<string, any[]>> = {
      'btech': {
        '1': [
          { id: 'math1', name: 'Mathematics I', code: 'MA101', description: 'Calculus and Linear Algebra', notes: 15 },
          { id: 'physics', name: 'Physics', code: 'PH101', description: 'Mechanics and Thermodynamics', notes: 12 },
          { id: 'chemistry', name: 'Chemistry', code: 'CH101', description: 'Organic and Inorganic Chemistry', notes: 10 },
          { id: 'english', name: 'English', code: 'EN101', description: 'Technical Communication', notes: 8 }
        ],
        '2': [
          { id: 'math2', name: 'Mathematics II', code: 'MA102', description: 'Differential Equations', notes: 18 },
          { id: 'programming', name: 'Programming', code: 'CS102', description: 'C/C++ Programming', notes: 22 },
          { id: 'electronics', name: 'Electronics', code: 'EC102', description: 'Basic Electronics', notes: 14 },
          { id: 'workshop', name: 'Workshop', code: 'ME102', description: 'Engineering Practices', notes: 6 }
        ],
        '3': [
          { id: 'dsa', name: 'Data Structures', code: 'CS301', description: 'Algorithms and Data Structures', notes: 25 },
          { id: 'dbms', name: 'DBMS', code: 'CS302', description: 'Database Management Systems', notes: 20 },
          { id: 'oop', name: 'OOP', code: 'CS303', description: 'Object Oriented Programming', notes: 18 },
          { id: 'os', name: 'Operating Systems', code: 'CS304', description: 'System Programming', notes: 16 }
        ]
      },
      'mca': {
        '1': [
          { id: 'programming', name: 'Programming in C', code: 'MCA101', description: 'Basic Programming Concepts', notes: 12 },
          { id: 'math', name: 'Discrete Mathematics', code: 'MCA102', description: 'Mathematical Foundations', notes: 15 },
          { id: 'computer', name: 'Computer Fundamentals', code: 'MCA103', description: 'Basic Computer Science', notes: 10 },
          { id: 'stats', name: 'Statistics', code: 'MCA104', description: 'Statistical Methods', notes: 8 }
        ]
      }
    };

    return subjects[courseId]?.[sem] || [
      { id: 'subject1', name: 'Subject 1', code: 'SUB101', description: 'Course material and notes', notes: 5 },
      { id: 'subject2', name: 'Subject 2', code: 'SUB102', description: 'Course material and notes', notes: 7 },
      { id: 'subject3', name: 'Subject 3', code: 'SUB103', description: 'Course material and notes', notes: 4 }
    ];
  };

  const subjects = getSubjects(course || '', semester || '');

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
          <Link to={`/dashboard/${course}`} className="hover:text-uninote-blue transition-colors">
            {getCourseName(course || '')}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-800">Semester {semester}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Semester {semester}{" "}
            <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
              Subjects
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a subject to access notes and study materials for {getCourseName(course || '')} Semester {semester}.
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <Card 
              key={subject.id}
              className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-4px] cursor-pointer"
              onClick={() => navigate(`/dashboard/${course}/${semester}/${subject.id}`)}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-uninote-blue to-uninote-purple flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-uninote-blue transition-colors">
                  {subject.name}
                </CardTitle>
                <div className="text-sm font-medium text-uninote-purple bg-uninote-purple/10 px-2 py-1 rounded-full inline-block mb-2">
                  {subject.code}
                </div>
                <CardDescription className="text-gray-600">
                  {subject.description}
                </CardDescription>
                <div className="text-sm text-gray-500 mt-2">
                  {subject.notes} notes available
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  className="w-full bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white font-medium rounded-xl transition-all duration-300"
                >
                  View Notes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SemesterView;
