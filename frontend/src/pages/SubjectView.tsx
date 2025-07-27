import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  GraduationCap, ChevronRight, Home, Download,
  FileText, Search, BookOpen, Eye, Calendar, User
} from "lucide-react";
import StarRating from "@/components/StarRating";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/lib/axiosInstance";

const SubjectView = () => {
  const { course, semester, subject } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [courseName, setCourseName] = useState<string>('');
  const [semesterName, setSemesterName] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});

  // 🛠 Fetch uploader names only once per user
  useEffect(() => {
    const fetchUserNames = async () => {
      const uniqueUserIds = new Set(notes.map(note => note.uploadedBy?._id).filter(Boolean));
      for (const userId of uniqueUserIds) {
        if (!userNames[userId]) {
          try {
            const res = await axios.get(`/notes/name/${userId}`);
            setUserNames(prev => ({ ...prev, [userId]: res.data.fullName }));
          } catch (error) {
            console.error("Failed to fetch user name:", error);
          }
        }
      }
    };

    if (notes.length > 0) fetchUserNames();
  }, [notes]);

  // 🧠 Fetch subject name
  useEffect(() => {
    const fetchSubjectName = async () => {
      try {
        const res = await axios.get(`/subjects/${subject}`);
        setSubjectName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch subject name", err);
      }
    };
    if (subject) fetchSubjectName();
  }, [subject]);

  // 📘 Fetch course name
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const res = await axios.get(`/courses/${course}`);
        setCourseName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch course name", err);
      }
    };
    if (course) fetchCourseName();
  }, [course]);

  // 📚 Fetch semester number
  useEffect(() => {
    const fetchSemesterName = async () => {
      try {
        const res = await axios.get(`/semesters/${semester}`);
        setSemesterName(res.data.number);
      } catch (err) {
        console.error("Failed to fetch semester name", err);
      }
    };
    if (semester) fetchSemesterName();
  }, [semester]);

  // 📄 Fetch all notes
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/notes/subject/${subject}`);
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to fetch notes", err);
        setError("Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };

    if (subject) fetchNotes();
  }, [subject]);

  const getFileTypeColor = (format: string = "") => {
    switch (format.toUpperCase()) {
      case "PDF": return "border-l-red-500";
      case "DOCX": return "border-l-blue-500";
      case "PPTX": return "border-l-yellow-500";
      default: return "border-l-gray-500";
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (note: any) => {
    if (!note.fileUrl) {
      toast.error("File URL not found. Cannot view note.");
      console.error("Missing fileUrl for note:", note);
      return;
    }

    const fileFormat = note.fileFormat?.toLowerCase();
    let viewerUrl = "";

    if (fileFormat === "pdf") {
      viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(note.fileUrl)}&embedded=true`;
    } else if (["docx", "pptx", "xlsx"].includes(fileFormat)) {
      viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(note.fileUrl)}`;
    } else {
      toast.error("Preview not supported for this file type.");
      return;
    }

    window.open(viewerUrl, "_blank");

    // Increment view count
    axios.get(`/notes/view/${note._id}`)
      .then(res => console.log(res.data.message))
      .catch(err => {
        console.error("Failed to update view count:", err);
      });
  };

  const handleDownload = async (noteId: string, title: string, format: string) => {
    toast.info("Preparing download...");
    try {
      const response = await axios.get(`/notes/download/${noteId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download started!");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed. The file may not be available.");
    }
  };

  const isPreviewSupported = (format: string) => {
    const lowerFormat = format.toLowerCase();
    return lowerFormat === "pdf";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
          <Link to="/dashboard" className="flex items-center hover:text-uninote-blue whitespace-nowrap">
            <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <Link to={`/dashboard/${course}`} className="hover:text-uninote-blue whitespace-nowrap truncate max-w-24 sm:max-w-none">
            {courseName}
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <Link to={`/dashboard/${course}/semester/${semester}`} className="hover:text-uninote-blue whitespace-nowrap">
            <span className="hidden sm:inline">Semester </span>
            <span className="sm:hidden">S</span>{semesterName}
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="font-medium text-gray-800 truncate max-w-32 sm:max-w-none">{subjectName}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
            {subjectName} <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">Notes</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Download verified study materials and notes for {subjectName}.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6 sm:mb-8 px-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 sm:top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notes..."
              className="pl-10 h-10 sm:h-12 bg-white/50 border-gray-200 focus:border-uninote-blue rounded-xl text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="text-center text-gray-500 py-8 sm:py-10">Loading notes...</div>
        )}
        {error && (
          <div className="text-center text-red-500 py-6">{error}</div>
        )}

        {/* Notes */}
        {!loading && !error && filteredNotes.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {filteredNotes.map((note) => (
              <Card
                key={note._id}
                className={`bg-white/80 backdrop-blur-sm border-l-4 ${getFileTypeColor(note.fileFormat)} shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
                      <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-2 sm:p-3 rounded-xl flex-shrink-0">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 break-words">{note.title}</h3>
                        
                        {/* Mobile: Stack metadata vertically */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            <span className="bg-gray-100 px-2 py-1 rounded-full font-medium text-xs">
                              {note.fileFormat}
                            </span>
                            <span className="text-xs sm:text-sm">{note.fileSize}</span>
                          </div>
                          
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span className="truncate max-w-24 sm:max-w-none">{userNames[note.uploadedBy?._id] || "Unknown"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span className="text-xs">{note.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                        
                        <StarRating
                          rating={note.rating || 0}
                          totalRatings={note.totalRatings || 0}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-stretch sm:items-end space-y-3 sm:space-y-2">
                      {/* Action Buttons */}
                      <div className="flex space-x-2 justify-stretch sm:justify-end">
                        <div className="relative group flex-1 sm:flex-initial">
                          <Button
                            onClick={() => isPreviewSupported(note.fileFormat) && handleView(note)}
                            variant="outline"
                            size="sm"
                            disabled={!isPreviewSupported(note.fileFormat)}
                            className={`w-full sm:w-auto flex items-center justify-center space-x-1 border-uninote-blue text-uninote-blue text-xs sm:text-sm h-8 sm:h-9
                              ${isPreviewSupported(note.fileFormat) ? 'hover:bg-uninote-blue hover:text-white' : 'cursor-not-allowed opacity-50'}`}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>View</span>
                          </Button>

                          {!isPreviewSupported(note.fileFormat) && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-90 transition-all duration-300 pointer-events-none whitespace-nowrap z-10">
                              Preview not supported
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleDownload(note._id, note.title, note.fileFormat)}
                          size="sm"
                          className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between sm:justify-end space-x-4 sm:space-x-6 text-xs text-gray-500 font-medium">
                        <div>Views: {note.views?.toLocaleString() || 0}</div>
                        <div>Downloads: {note.downloads.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
              <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Notes Found</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              {searchQuery
                ? `No notes match your search for "${searchQuery}"`
                : "No notes have been uploaded for this subject yet. Check back later!"}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SubjectView;