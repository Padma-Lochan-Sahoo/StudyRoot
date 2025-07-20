import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";

interface EditNoteModalProps {
  note: any;
  onClose: () => void;
  onUpdate: (updatedNote: any) => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ note, onClose, onUpdate }) => {
  const [title, setTitle] = useState(note.title || "");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      const form = new FormData();
      form.append("title", title);
      if (file) {
        form.append("file", file);
      }

      const res = await axios.put(`/notes/update/${note._id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpdate(res.data.note);
      toast({ title: "Updated", description: "Note updated successfully" });
      onClose();
    } catch (err: any) {
      console.error("Update failed", err);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Note</h2>

        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
          placeholder="Enter new title"
        />

        <Input
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500"
            onClick={handleUpdate}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;
