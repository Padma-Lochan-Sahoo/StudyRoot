// components/NoteCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Edit, Trash2, Download, Calendar, User } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete }) => {
  const getFileTypeColor = (format: string = "") => {
    switch (format.toUpperCase()) {
      case "PDF": return "border-l-red-500";
      case "DOCX": return "border-l-blue-500";
      case "PPTX": return "border-l-yellow-500";
      default: return "border-l-gray-500";
    }
  };

  const getFileTypeIcon = (format: string = "") => {
    const iconClass = "h-5 w-5 sm:h-6 sm:w-6 text-white";
    return <FileText className={iconClass} />;
  };

  // const formatDate = (dateString: string) => {
  //   try {
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString('en-US', { 
  //       year: 'numeric', 
  //       month: 'short', 
  //       day: 'numeric' 
  //     });
  //   } catch {
  //     return dateString;
  //   }
  // };

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${getFileTypeColor(note.fileFormat)} group`}>
      <CardContent className="p-4 sm:p-6">
        {/* Mobile Layout */}
        <div className="block sm:hidden space-y-4">
          {/* Header with icon and title */}
          <div className="flex items-start space-x-3">
            <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-2 rounded-lg shrink-0">
              {getFileTypeIcon(note.fileFormat)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-2">{note.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {note.subject?.semester?.course?.name}
              </p>
              <p className="text-sm text-gray-500">
                Semester {note.subject?.semester?.number} • {note.subject?.name}
              </p>
            </div>
          </div>
          
          {/* Metadata */}
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{note.uploadedBy?.fullName || "Unknown"}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{note.uploadDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="h-3 w-3" />
                <span>{note.downloads} downloads</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 text-xs"
              onClick={() => onEdit(note)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(note._id, note.title)}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4 flex-1 min-w-0">
              <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-3 rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-200">
                {getFileTypeIcon(note.fileFormat)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1 pr-4">{note.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full shrink-0 ml-2">
                    {note.fileFormat?.toUpperCase() || 'FILE'}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-1">
                  {note.subject?.semester?.course?.name} • Semester {note.subject?.semester?.number} • {note.subject?.name}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span className="truncate">By: {note.uploadedBy?.fullName || "Unknown"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>On: {note.uploadDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{note.downloads} downloads</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 shrink-0 ml-4">
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                onClick={() => onEdit(note)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(note._id, note.title)}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;