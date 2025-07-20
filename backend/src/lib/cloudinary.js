import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Cloudinary config
const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

// Stream upload function
export const streamUpload = (buffer, originalFilename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "studyroot",
        upload_preset: "studyroot_public",
        resource_type: "raw",
        access_mode: "public",
        // THIS IS THE FIX 👇
        filename_override: originalFilename,
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default connectCloudinary;
