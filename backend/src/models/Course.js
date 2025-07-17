import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['B.Tech', 'MCA','BCA','BBA','MBA','B.Com','M.Com','B.Sc','M.Sc','B.A','M.A','others']
  },
  totalSemesters: {
    type: Number,
    required: true,
    default: 8,
  },
});
const Course = mongoose.model('Course', courseSchema);
export default Course;