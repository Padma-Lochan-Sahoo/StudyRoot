import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  GraduationCap,
  LogOut,
  User,
  BookOpen,
  Code,
  Building,
  Briefcase,
  MoreHorizontal
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/lib/axiosInstance";

// Meta map to assign icons & colors based on course name
const courseMeta = {
  "B.Tech": { icon: Code, color: "from-blue-500 to-cyan-500" },
  MCA: { icon: BookOpen, color: "from-purple-500 to-pink-500" },
  BCA: { icon: Building, color: "from-green-500 to-teal-500" },
  MBA: { icon: Briefcase, color: "from-orange-500 to-red-500" },
  others: { icon: MoreHorizontal, color: "from-gray-500 to-slate-500" }
};

const Dashboard = () => {
  const navigate = useNavigate(); // ✅ Top level
  const { authUser } = useAuthStore(); // ✅ Top level

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await axios.get("/courses");
        setCourses(response.data);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50">
      <Navbar userName={authUser?.fullName || "Guest"} />

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
            Choose your course to access semester-wise notes and study
            materials. Everything you need for academic success, organized and
            ready to download.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const meta = courseMeta[course.name] || {};
            const IconComponent = meta.icon || GraduationCap;
            const color = meta.color || "from-gray-300 to-gray-500";

            return (
              <Card
                key={course._id}
                className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
onClick={() => navigate(`/dashboard/${course._id}`)}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 group-hover:text-uninote-blue transition-colors">
                    {course.name}
                  </CardTitle>

                  <div className="text-sm text-gray-500 mt-2">
                    {course.totalSemesters} Semesters
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white font-medium rounded-xl transition-all duration-300">
                    View Semesters
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <StatsCard />
      </div>
    </div>
  );
};

export default Dashboard;
