import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const params = {
  folder: "learning-management-system",
  allowedFormats: ["jpeg", "jpg", "png"],
};

const avatarParams = {
  folder: "learning-management-system/avatar",
  allowedFormats: ["jpeg", "jpg", "png"],
};

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params,
});

export const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: avatarParams,
});
