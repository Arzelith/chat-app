const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const upload = async (file, id) => {
  const result = await cloudinary.uploader.upload(file, {
    public_id: `user_avatar_${id}`,
    folder: 'assets/chat-app/avatar/',
    overwrite: true,
    allowed_formats: ['jpg', 'png', 'gif'],
    faces: true,
  });
  return result;
};

module.exports = { upload };
