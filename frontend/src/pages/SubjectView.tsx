import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, ChevronRight, Home, Download, FileText, Search, BookOpen, Eye, Calendar, User } from "lucide-react";
import StarRating from "@/components/StarRating";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/lib/axiosInstance"; // or just "axios" if not using custom instance

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

  // Fetch subject name
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

  // Fetch course name
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

  // FIXED: Watch semester, not course
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

  // Fetch notes
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
      case "PDF":
        return "border-l-red-500";
      case "DOCX":
        return "border-l-blue-500";
      case "PPTX":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-500";
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (noteId: string) => {
    window.open(`/api/notes/view/${noteId}`, "_blank");
  };

  const handleDownload = (noteId: string) => {
    window.open(`/api/notes/download/${noteId}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-uninote-light via-white to-blue-50">
      {/* Navbar */}
      <Navbar userName={authUser?.fullName || "Guest"} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/dashboard" className="flex items-center hover:text-uninote-blue">
            <Home className="h-4 w-4 mr-1" /> Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/dashboard/${course}`} className="hover:text-uninote-blue">{courseName}</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/dashboard/${course}/${semester}`} className="hover:text-uninote-blue">
            Semester {semesterName}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-800">{subjectName}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {subjectName}{" "}
            <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">Notes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Download verified study materials and notes for {subjectName}.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notes..."
              className="pl-10 h-12 bg-white/50 border-gray-200 focus:border-uninote-blue rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading/Error */}
        {loading && (
          <div className="text-center text-gray-500 py-10">Loading notes...</div>
        )}
        {error && (
          <div className="text-center text-red-500 py-6">{error}</div>
        )}

        {/* Notes List */}
        {!loading && !error && filteredNotes.length > 0 ? (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <Card
                key={note._id}
                className={`bg-white/80 backdrop-blur-sm border-l-4 ${getFileTypeColor(note.fileFormat)} shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-3 rounded-xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{note.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                            {note.fileFormat}
                          </span>
                          <span>{note.fileSize}</span>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{note.uploadedBy?.fullName || "Unknown"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{note.uploadDate}</span>
                          </div>
                        </div>
                        <StarRating
                          rating={note.rating || 0}
                          totalRatings={note.totalRatings || 0}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleView(note._id)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1 border-uninote-blue text-uninote-blue hover:bg-uninote-blue hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                        <Button
                          onClick={() => handleDownload(note._id)}
                          size="sm"
                          className="flex items-center space-x-1 bg-gradient-to-r from-uninote-blue to-uninote-purple hover:from-uninote-purple hover:to-uninote-blue"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        Downloads: {note.downloads.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Notes Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
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
