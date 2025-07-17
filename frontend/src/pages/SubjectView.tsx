
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, ChevronRight, Home, Download, FileText, Search, BookOpen, Eye, Calendar, User } from "lucide-react";
import UserDropdown from "@/components/UserDropdown";
import StarRating from "@/components/StarRating";
import Navbar from "@/components/Navbar"; 
import { useAuthStore } from "@/store/useAuthStore";

const SubjectView = () => {
  const { course, semester, subject } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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

  const getSubjectName = (subjectId: string) => {
    const subjectNames: Record<string, string> = {
      'math1': 'Mathematics I',
      'physics': 'Physics',
      'chemistry': 'Chemistry',
      'english': 'English',
      'dsa': 'Data Structures',
      'dbms': 'DBMS',
      'oop': 'Object Oriented Programming',
      'os': 'Operating Systems'
    };
    return subjectNames[subjectId] || subjectId;
  };

  const getFileTypeColor = (format: string) => {
    switch (format.toUpperCase()) {
      case 'PDF':
        return 'border-l-red-500';
      case 'DOCX':
        return 'border-l-blue-500';
      case 'PPTX':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-500';
    }
  };

  // Sample notes data with enhanced information
  const notes = [
    {
      id: 1,
      title: "Introduction to Data Structures",
      uploadedBy: "Dr. Sarah Johnson",
      format: "PDF",
      size: "2.5 MB",
      downloads: 1250,
      uploadDate: "2024-01-15",
      rating: 4.5,
      totalRatings: 23
    },
    {
      id: 2,
      title: "Arrays and Linked Lists - Complete Guide",
      uploadedBy: "Prof. Kumar Singh",
      format: "PDF",
      size: "3.2 MB",
      downloads: 980,
      uploadDate: "2024-01-12",
      rating: 4.2,
      totalRatings: 18
    },
    {
      id: 3,
      title: "Stack and Queue Operations",
      uploadedBy: "UniNote Team",
      format: "DOCX",
      size: "1.8 MB",
      downloads: 756,
      uploadDate: "2024-01-10",
      rating: 4.0,
      totalRatings: 15
    },
    {
      id: 4,
      title: "Tree Data Structures and Algorithms",
      uploadedBy: "Dr. Amit Singh",
      format: "PDF",
      size: "4.1 MB",
      downloads: 1120,
      uploadDate: "2024-01-08",
      rating: 4.7,
      totalRatings: 31
    },
    {
      id: 5,
      title: "Graph Algorithms Presentation",
      uploadedBy: "Prof. Lisa Chen",
      format: "PPTX",
      size: "3.7 MB",
      downloads: 894,
      uploadDate: "2024-01-05",
      rating: 4.3,
      totalRatings: 27
    }
  ];

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (noteId: number, title: string) => {
    console.log(`Downloading note: ${title}`);
  };

  const handleView = (noteId: number, title: string) => {
    console.log(`Viewing note: ${title}`);
  };

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
          <Link to={`/dashboard/${course}/${semester}`} className="hover:text-uninote-blue transition-colors">
            Semester {semester}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-800">{getSubjectName(subject || '')}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {getSubjectName(subject || '')}{" "}
            <span className="bg-gradient-to-r from-uninote-blue to-uninote-purple bg-clip-text text-transparent">
              Notes
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Download verified study materials and notes for {getSubjectName(subject || '')}.
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

        {/* Notes List */}
        {filteredNotes.length > 0 ? (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <Card 
                key={note.id}
                className={`bg-white/80 backdrop-blur-sm border-l-4 ${getFileTypeColor(note.format)} shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Left section - File icon */}
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-3 rounded-xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      
                      {/* Center section - Note details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{note.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                            {note.format}
                          </span>
                          <span>{note.size}</span>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{note.uploadedBy}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(note.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <StarRating rating={note.rating} totalRatings={note.totalRatings} size="sm" />
                      </div>
                    </div>

                    {/* Right section - Action buttons */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleView(note.id, note.title)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1 border-uninote-blue text-uninote-blue hover:bg-uninote-blue hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                        <Button 
                          onClick={() => handleDownload(note.id, note.title)}
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
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Notes Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchQuery 
                ? `No notes match your search for "${searchQuery}"`
                : "No notes have been uploaded for this subject yet. Check back later!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectView;
