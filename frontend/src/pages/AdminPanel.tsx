
import { useEffect, useState } from "react";

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.course || !formData.semester || !formData.subject || !formData.title || !formData.file) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a file.",
        variant: "destructive"
      });
      return;
    }

    // Simulate upload
    toast({
      title: "Success",
      description: "Note uploaded successfully!",
    });

    // Reset form
    setFormData({
      course: "",
      semester: "",
      subject: "",
      title: "",
      file: null
    });
  };

  const handleDelete = (id: number, title: string) => {
    toast({
      title: "Success",
      description: `"${title}" has been deleted.`,
    });
  };

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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Upload{" "}
                <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
                  Notes
                </span>
              </h1>
              <p className="text-gray-600">
                Upload verified study materials for students to access.
              </p>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Note</span>
                </CardTitle>
                <CardDescription>
                  Fill in the details below to upload a new study material.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                        <SelectTrigger className="h-12 bg-white/50 border-gray-200">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btech">B.Tech</SelectItem>
                          <SelectItem value="mca">MCA</SelectItem>
                          <SelectItem value="bca">BCA</SelectItem>
                          <SelectItem value="mba">MBA</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select value={formData.semester} onValueChange={(value) => handleInputChange("semester", value)}>
                        <SelectTrigger className="h-12 bg-white/50 border-gray-200">
                          <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 8 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              Semester {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Enter subject name (e.g., Data Structures, DBMS)"
                      className="h-12 bg-white/50 border-gray-200 focus:border-uninote-blue"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Note Title</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter descriptive title for the note"
                      className="h-12 bg-white/50 border-gray-200 focus:border-uninote-blue"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-white/50">
                      <input
                        id="file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Supported formats: PDF, DOC, DOCX (Max size: 10MB)
                      </p>
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-white font-medium rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Note
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
                <Card key={note.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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
