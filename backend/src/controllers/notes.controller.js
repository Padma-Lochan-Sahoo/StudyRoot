import axios from "axios";
import User from "../models/user.model.js";
import Course from "../models/Course.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";
import Note from "../models/Note.js";
import { streamUpload } from "../lib/cloudinary.js";
import path from "path";



export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate({
        path: "subject",
        select: "name semester",
        populate: {
          path: "semester",
          select: "number course",
          populate: {
            path: "course",
            select: "name"
          }
        }
      })
      .populate("uploadedBy", "fullName")
      .populate("fileFormat", "format");

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching all notes:", error);
    res.status(500).json({ message: "Error fetching notes", error });
  }
};



export const getAllNotesByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user authentication middleware
    const notes = await Note.find({ uploadedBy: userId })
      .populate("subject", "name")
      .populate("uploadedBy", "fullName");
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching user's notes:", error);
    res.status(500).json({ message: "Error fetching user's notes", error });
  }
};

// Update Note - admin can update only title and update file
export const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const { title } = req.body;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Optional: check for duplicate title under same subject
    if (title && title !== note.title) {
      const duplicate = await Note.findOne({ title, subject: note.subject });
      if (duplicate) {
        return res.status(400).json({
          message: "A note with this title already exists under the same subject",
        });
      }
      note.title = title;
    }

    if (req.file) {
      const result = await streamUpload(req.file.buffer, req.file.originalname);

      const ext = path.extname(req.file.originalname || "").toLowerCase().replace(".", "");
      let fileFormat = ext;
      if (["doc", "docx"].includes(ext)) fileFormat = "docx";
      else if (["ppt", "pptx"].includes(ext)) fileFormat = "pptx";
      else if (["xls", "xlsx"].includes(ext)) fileFormat = "xlsx";

      // ✅ Only allow known valid formats
      const validFormats = ["pdf", "docx", "txt", "pptx", "xlsx"];
      if (!validFormats.includes(fileFormat)) {
        return res.status(400).json({ message: "Unsupported file format" });
      }

      // Optionally: delete old file from Cloudinary here

      note.fileUrl = result.secure_url;
      note.fileFormat = fileFormat;
      note.fileSize = `${(req.file.size / 1024 / 1024).toFixed(2)} MB`;
    }

    await note.save();
    // ✅ Populate subject -> semester -> course and uploadedBy
    const populatedNote = await Note.findById(note._id)
      .populate({
        path: "subject",
        populate: {
          path: "semester",
          populate: {
            path: "course",
          },
        },
      })
      .populate("uploadedBy");

    return res.status(200).json({ success: true, note: populatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note", error });
  }
};


export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note", error });
  }
};


// format date
export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months start from 0
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getNotesBySubject = async (req, res) => {
  const { subjectId } = req.params;
  try {
    const notes = await Note.find({ subject: subjectId }).populate(
      "uploadedBy",
      "_id"
    );
    res.status(200).json(notes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notes for subject", error });
  }
};
// export const uploadNote = async (req, res) => {
//   try {
//     const { course, semester, subjectName, title } = req.body;

//     // Step 1: Get or create Course
//     let foundCourse = await Course.findOne({ name: course });
//     if (!foundCourse) {
//       return res.status(400).json({ success: false, message: "Invalid course name" });
//     }

//     // Step 2: Get or create Semester
//     let foundSemester = await Semester.findOne({
//       course: foundCourse._id,
//       number: parseInt(semester),
//     });
//     if (!foundSemester) {
//       foundSemester = await Semester.create({
//         course: foundCourse._id,
//         number: parseInt(semester),
//       });
//     }

//     // Step 3: Get or create Subject
//     let foundSubject = await Subject.findOne({
//       name: subjectName,
//       semester: foundSemester._id,
//     });
//     if (!foundSubject) {
//       const autoGeneratedCode = `${course
//         .slice(0, 3)
//         .toUpperCase()}-${semester}-${Math.floor(1000 + Math.random() * 9000)}`;
//       foundSubject = await Subject.create({
//         name: subjectName,
//         subjectCode: autoGeneratedCode,
//         semester: foundSemester._id,
//       });
//     }

//     // Step 4: Check for duplicate Note
//     const existingNote = await Note.findOne({
//       title,
//       subject: foundSubject._id,
//     });
//     if (existingNote) {
//       return res.status(400).json({
//         success: false,
//         message: "Note with same title already exists under this subject",
//       });
//     }

//     // Step 5: Upload to Cloudinary
//     const result = await streamUpload(req.file.buffer, req.file.originalname);

//     // Step 6: Extract file extension
//     const originalName = req.file.originalname || "";
//     const ext = path.extname(originalName).toLowerCase().replace(".", ""); // e.g., 'pdf'

//     // Normalize extensions
//     let fileFormat = ext;
//     if (["doc", "docx"].includes(ext)) fileFormat = "docx";
//     else if (["ppt", "pptx"].includes(ext)) fileFormat = "pptx";
//     else if (["xls", "xlsx"].includes(ext)) fileFormat = "xlsx";

//     if (!["pdf", "docx", "txt", "pptx", "xlsx"].includes(fileFormat)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Unsupported file format" });
//     }
//     const now = new Date();
//     // Step 6: Create and save Note
//     const note = new Note({
//       title,
//       fileUrl: result.secure_url,
//       fileSize: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
//       subject: foundSubject._id,
//       uploadedBy: req.user._id,
//       fileFormat,
//       uploadDate: formatDate(now),
//     });

//     await note.save();

//     return res.status(201).json({ success: true, note });
//   } catch (error) {
//     console.error("Upload Note Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Something went wrong during note upload",
//     });
//   }
// };

//Download Note
// /controllers/notes.controller.js
// /controllers/notes.controller.js


export const uploadNote = async (req, res) => {
  try {
    const { course, semester, subjectName, title } = req.body;

    // Step 1: Find Course by ID (sent from frontend)
    const foundCourse = await Course.findById(course);
    if (!foundCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Step 2: Find Semester by ID (sent from frontend)
    const foundSemester = await Semester.findById(semester);
    if (!foundSemester || String(foundSemester.course) !== String(course)) {
      return res.status(404).json({ success: false, message: "Semester not found or mismatched with course" });
    }

    // Step 3: Get or create Subject (by name under selected semester)
    let foundSubject = await Subject.findOne({ name: subjectName, semester: foundSemester._id });
    if (!foundSubject) {
      const autoGeneratedCode = `${foundCourse.name.slice(0, 3).toUpperCase()}-${foundSemester.number}-${Math.floor(1000 + Math.random() * 9000)}`;
      foundSubject = await Subject.create({
        name: subjectName,
        subjectCode: autoGeneratedCode,
        semester: foundSemester._id,
      });
    }

    // Step 4: Prevent duplicate note titles under the same subject
    const existingNote = await Note.findOne({ title, subject: foundSubject._id });
    if (existingNote) {
      return res.status(400).json({
        success: false,
        message: "Note with same title already exists under this subject",
      });
    }

    // Step 5: Upload file to Cloudinary
    const result = await streamUpload(req.file.buffer, req.file.originalname);

    // Step 6: Determine file format
    const ext = path.extname(req.file.originalname || "").toLowerCase().replace(".", "");
    let fileFormat = ext;
    if (["doc", "docx"].includes(ext)) fileFormat = "docx";
    else if (["ppt", "pptx"].includes(ext)) fileFormat = "pptx";
    else if (["xls", "xlsx"].includes(ext)) fileFormat = "xlsx";

    if (!["pdf", "docx", "txt", "pptx", "xlsx"].includes(fileFormat)) {
      return res.status(400).json({ success: false, message: "Unsupported file format" });
    }

    // Step 7: Save the note
    const now = new Date();
    const note = new Note({
      title,
      fileUrl: result.secure_url,
      fileSize: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      subject: foundSubject._id,
      uploadedBy: req.user._id,
      fileFormat,
      uploadDate: formatDate(now), // returns dd-mm-yyyy
    });

    await note.save();

    res.status(201).json({ success: true, note });
  } catch (error) {
    console.error("Upload Note Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong during note upload" });
  }
};
export const downloadNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    console.log("Attempting to download from URL:", note.fileUrl);

    note.downloads = (note.downloads || 0) + 1;
    await note.save();

    const fileResponse = await axios.get(note.fileUrl, {
      responseType: "stream",
    });

    // Set correct headers so browser understands it's a downloadable file
    res.setHeader("Content-Type", fileResponse.headers["content-type"]);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${note.title}.${note.fileFormat}"`
    );

    // Pipe stream directly to response
    fileResponse.data.pipe(res);
  } catch (error) {
    console.error("Download Note Error Details:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong during note download",
    });
  }
};

// viewNote.js (or inside your controller)
export const viewNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Use findOneAndUpdate with $inc for an atomic and efficient update.
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $inc: { views: 1 } },
      { new: true } // This option returns the document after it has been updated.
    );

    if (!updatedNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    // The view has been successfully counted.
    res.status(200).json({ success: true, message: "View count incremented." });
  } catch (error) {
    console.error("View Note Error (incrementing count):", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update view count" });
  }
};
export const getNameByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error("Get User Name Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user name" });
  }
};
