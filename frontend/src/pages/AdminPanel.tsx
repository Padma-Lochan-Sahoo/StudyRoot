import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import SidebarNav from "@/components/admin/SidebarNav";
import UploadForm from "@/components/admin/UploadForm";
import ManageNotesSection from "@/components/admin/ManageNotesSection";
import EditNoteModal from "@/components/admin/EditNoteModel";
import axios from "@/lib/axiosInstance";

const AdminPanel = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("upload");
  const [loading, setLoading] = useState(false);
  const [noteBeingEdited, setNoteBeingEdited] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [courses, setCourses] = useState<any[]>([]);
  const [uploadedNotes, setUploadedNotes] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    course: "",
    semester: "",
    subject: "",
    title: "",
    file: null as File | null,
  });

  const [isSemesterDisabled, setIsSemesterDisabled] = useState(true);
  const [isSubjectDisabled, setIsSubjectDisabled] = useState(true);

  // Logout handler
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      course: "",
      semester: "",
      subject: "",
      title: "",
      file: null,
    });
    setIsSemesterDisabled(true);
    setIsSubjectDisabled(true);
  };

  const handleCourseChange = async (courseId: string) => {
    handleInputChange("course", courseId);
    handleInputChange("semester", "");
    handleInputChange("subject", "");
    setIsSemesterDisabled(true);
    setIsSubjectDisabled(true);
    try {
      const res = await axios.get(`/semesters/course/${courseId}`);
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
      const res = await axios.get(`/subjects/semester/${semesterId}`);
      setSubjects(res.data || []);
      setIsSubjectDisabled(false);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
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
      resetForm();
      setSemesters([]);
      setSubjects([]);
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

  const handleDelete = async (id: string, title: string) => {
    try {
      await axios.delete(`/notes/${id}`);
      setUploadedNotes((prev) => prev.filter((note) => note._id !== id));
      toast({ title: "Deleted", description: `"${title}" has been deleted.` });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
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
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex justify-center items-start p-10">
        {activeTab === "upload" && (
          <UploadForm
            courses={courses}
            semesters={semesters}
            subjects={subjects}
            formData={formData}
            loading={loading}
            isSemesterDisabled={isSemesterDisabled}
            isSubjectDisabled={isSubjectDisabled}
            onChange={handleInputChange}
            onCourseChange={handleCourseChange}
            onSemesterChange={handleSemesterChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
          />
        )}

        {activeTab === "manage" && (
          <ManageNotesSection
            notes={uploadedNotes}
            onEdit={(note) => {
              setNoteBeingEdited(note);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}

        {isEditModalOpen && noteBeingEdited && (
          <EditNoteModal
            note={noteBeingEdited}
            onClose={() => {
              setIsEditModalOpen(false);
              setNoteBeingEdited(null);
            }}
            onUpdate={(updatedNote) => {
              setUploadedNotes((prev) =>
                prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
