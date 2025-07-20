// components/NoteCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Edit, Trash2 } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-r from-uninote-blue to-uninote-purple p-3 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{note.title}</h3>
              <p className="text-gray-600 mb-2">
                {note.subject?.semester?.course?.name} • Semester {note.subject?.semester?.number} • {note.subject?.name}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Uploaded By: {note.uploadedBy?.fullName || "Unknown"}</span>
                <span>Uploaded On: {note.uploadDate}</span>
                <span>Downloads: {note.downloads}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => onEdit(note)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(note._id, note.title)}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
