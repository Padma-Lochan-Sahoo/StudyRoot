// AdminPanel.tsx

import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap, Upload, FileText, Edit, Trash2, Plus, LogOut, Users, BookOpen, Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";

const AdminPanel = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [loading, setLoading] = useState(false);

  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [uploadedNotes, setUploadedNotes] = useState<any[]>([]);


  const [isSemesterDisabled, setIsSemesterDisabled] = useState(true);
  const [isSubjectDisabled, setIsSubjectDisabled] = useState(true);

  const [formData, setFormData] = useState({
    course: "",
    semester: "",
    subject: "",
    title: "",
    file: null as File | null,
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { course, semester, subject, title, file } = formData;
    if (!course || !semester || !subject || !title || !file) {
      return toast({
        title: "Error",
        description: "Fill in all fields",
        variant: "destructive",
      });
    }

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
  if (activeTab === "manage") {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("/notes");
        setUploadedNotes(res.data || []);
      } catch (err) {
        console.error("Error fetching notes", err);
      }
    };
    fetchNotes();
  }
}, [activeTab]);


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

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-start p-10">
        {activeTab === "upload" && (
          <div className="w-full max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Upload <span className="text-uninote-purple">Notes</span>
            </h1>
            <p className="text-gray-500 mb-6">
              Upload verified study materials for students to access.
            </p>

            <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
                  <Plus className="h-5 w-5" />
                  <span>Add New Note</span>
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the details below to upload a new study material.
                </p>
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
                      placeholder="Enter descriptive title for the note"
                      required
                    />
                  </div>

                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Label className="block mb-2">Upload File</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileChange}
                      required
                      className="file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                    />
                    <p className="left-0 mt-2 text-sm text-gray-500">
                      Supported formats: PDF, DOC, DOCX (Max size: 10MB)
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Note
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "manage" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Manage{" "}
                <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
                  Notes
                </span>
              </h1>
              <p className="text-gray-600">
                View and manage all uploaded study materials.
              </p>
            </div>

            <div className="grid gap-6">
              {uploadedNotes.map((note) => (
                <Card key={note._id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-3 rounded-xl">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{note.title}</h3>
                          <p className="text-gray-600 mb-2">
                            {note.course} • Semester {note.semester} • {note.subject}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Uploaded: {note.uploadDate}</span>
                            <span>Downloads: {note.downloads}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(note.id, note.title)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
