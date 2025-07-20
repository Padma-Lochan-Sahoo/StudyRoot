
import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Upload, FileText, Edit, Trash2, Plus, LogOut, Users, BookOpen, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

const AdminPanel = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");

const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

const [isSemesterDisabled, setIsSemesterDisabled] = useState(true);
const [isSubjectDisabled, setIsSubjectDisabled] = useState(true);


  const [formData, setFormData] = useState({
    course: "",
    semester: "",
    subject: "",
    title: "",
    file: null as File | null
  });


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

const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};
  const uploadedNotes = [
    {
      id: 1,
      title: "Introduction to Data Structures",
      course: "B.Tech",
      semester: "3",
      subject: "DSA",
      uploadDate: "2024-01-15",
      downloads: 1250
    },
    {
      id: 2,
      title: "Database Management Systems",
      course: "B.Tech",
      semester: "4",
      subject: "DBMS",
      uploadDate: "2024-01-10",
      downloads: 980
    }
  ];

   const handleCourseChange = async (courseId: string) => {
    handleInputChange("course", courseId);
    handleInputChange("semester", "");
    handleInputChange("subject", "");
    setIsSemesterDisabled(true);
    setIsSubjectDisabled(true);
    try {
      const res = await axios.get(`semesters/course/${courseId}`);
      setSemesters(res.data || []);
      setIsSemesterDisabled(false);
    } catch (err) {
      console.error("Failed to fetch semesters", err);
    }
  };
  const handleSemesterChange = async (semesterId: string) => {
    handleInputChange("semester", semesterId);
    handleInputChange("subject", "");
    setIsSubjectDisabled(true);
    try {
      const res = await axios.get(`subjects/semester/${semesterId}`);
      setSubjects(res.data || []);
      setIsSubjectDisabled(false);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { course, semester, subject, title, file } = formData;
    if (!course || !semester || !subject || !title || !file) {
      return toast({ title: "Error", description: "Fill in all fields", variant: "destructive" });
    }

    try {
      const data = new FormData();
      data.append("course", course);
      data.append("semester", semester);
      data.append("subjectName", subject);
      data.append("title", title);
      data.append("file", file);

      await axios.post("/notes/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Success", description: "Note uploaded successfully!" });

      setFormData({
        course: "",
        semester: "",
        subject: "",
        title: "",
        file: null,
      });
      setSemesters([]);
      setSubjects([]);
      setIsSemesterDisabled(true);
      setIsSubjectDisabled(true);
    } catch (err: any) {
      toast({
        title: "Upload Error",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: number, title: string) => {
    toast({
      title: "Success",
      description: `"${title}" has been deleted.`,
    });
  };
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/courses");
        console.log("Fetched courses:", res.data);
        
        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };
    fetchCourses();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50 flex">
      {/* Sidebar */}
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
            <p className="text-sm text-yellow-800 font-medium">
              🔒 Admin Panel
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Administrative access only
            </p>
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "upload" && (
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Notes</h1>

            <Card className="bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Note</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Course</Label>
                      <Select value={formData.course} onValueChange={handleCourseChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Semester</Label>
                      <Select
                        disabled={isSemesterDisabled}
                        value={formData.semester}
                        onValueChange={handleSemesterChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map((sem) => (
                            <SelectItem key={sem._id} value={sem._id}>
                              Semester {sem.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Subject</Label>
                    <Select
                      disabled={isSubjectDisabled}
                      value={formData.subject}
                      onValueChange={(val) => handleInputChange("subject", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((sub) => (
                          <SelectItem key={sub._id} value={sub.name}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Note Title</Label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter title"
                      required
                    />
                  </div>

                  <div>
                    <Label>Upload File</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Note
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;