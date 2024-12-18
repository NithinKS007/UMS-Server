import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

interface UploadImageParams {
  image: string;
  folder: string;
}

export const uploadImage = async ({
  image,
  folder,
}: UploadImageParams): Promise<string> => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });

    const result: UploadApiResponse = await cloudinary.uploader.upload(image, {
      folder: folder,
    });

    return result.secure_url;
  } catch (error) {
    console.log("Error while uploading the image:", error);
    throw new Error("Image upload failed.");
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    console.log("image", imageUrl);
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });

    const parts = imageUrl.split("/")
    
    const filename =  parts.slice(7, parts.length).join("/");
    
    const publicId = filename ? filename.split(".")[0] : null;

    if (!publicId) return;

    const response = await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary Response:", response);

    console.log("Image deleted successfully.");
  } catch (error) {
    console.error("Error deleting image in Cloudinary:", error);
    throw new Error("Image deletion failed: " + error);
  }
};
