import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
});

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;