import cloudinary from "../lib/cloudinary.js";
import Course from "../models/Course.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";
import Note from "../models/Note.js";
import streamifier from "streamifier";

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'studynotes',
        resource_type: 'auto',
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadNote = async (req, res) => {
  try {
    const { title, description, course, semester, subjectName, uploadedBy } = req.body;

    // Step 1: Get or create Course
    let foundCourse = await Course.findOne({ name: course });
    if (!foundCourse) {
      foundCourse = await Course.create({ name: course });
    }

    // Step 2: Get or create Semester
    let foundSemester = await Semester.findOne({ course: foundCourse._id, number: parseInt(semester) });
    if (!foundSemester) {
      foundSemester = await Semester.create({ course: foundCourse._id, number: parseInt(semester) });
    }

    // Step 3: Get or create Subject
    let foundSubject = await Subject.findOne({ name: subjectName, semester: foundSemester._id });
    if (!foundSubject) {
      foundSubject = await Subject.create({ name: subjectName, semester: foundSemester._id });
    }

    // Step 4: Check for duplicate Note
    const existingNote = await Note.findOne({ title, subject: foundSubject._id });
    if (existingNote) {
      return res.status(400).json({ success: false, message: 'Note with same title already exists under this subject' });
    }

    // Step 5: Upload to Cloudinary
    const result = await streamUpload(req.file.buffer);

    // Step 6: Create and save Note
    const note = new Note({
      title,
      description,
      fileUrl: result.secure_url,
      fileSize: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      subject: foundSubject._id,
      uploadedBy,
    });

    await note.save();

    return res.status(201).json({ success: true, note });

  } catch (error) {
    console.error("Upload Note Error:", error);
    res.status(500).json({ success: false, message: 'Something went wrong during note upload' });
  }
};