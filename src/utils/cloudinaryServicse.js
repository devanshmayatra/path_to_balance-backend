import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(
      localFilePath,
      {
        folder: 'path_to_balance/avatars',
        resource_type: 'auto',
      }
    );

    //when file is succesfully uploaded

    fs.unlinkSync(localFilePath); // remove the locally saved temporary file after the upload was succesfull
    return response;

  } catch (error) {
    console.log(error)
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload got failed
    return null;
  }
}

export { uploadOnCloudinary };