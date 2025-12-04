import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Make sure dotenv is loaded
dotenv.config();

// Direct configuration with fallbacks
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpukfzbtq',
  api_key: process.env.CLOUDINARY_API_KEY || '247631885815282',
  api_secret: process.env.CLOUDINARY_API_SECRET || '-wWHiXP2HqbmzXqhEFd3G42e5uo',
  secure: true
};

console.log('Cloudinary Configuration:', {
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key ? '***' + cloudinaryConfig.api_key.slice(-4) : 'missing',
  api_secret: cloudinaryConfig.api_secret ? '***' + cloudinaryConfig.api_secret.slice(-4) : 'missing'
});

cloudinary.config(cloudinaryConfig);

// Verify configuration
console.log('Cloudinary configured successfully');

export default cloudinary;