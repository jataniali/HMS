import multer from "multer";
import cloudinary from '../config/cloudinary.js'


const storage =multer.memoryStorage();
export const upload = multer({storage})

class uploadController{

// upload file
static async uploadFile(req,res){
try {
  console.log('Upload request received');
  console.log('File:', req.file);
 
  if(!req.file){
    return res.status(400).json({message:"No file uploaded"})
  }  
 
  console.log('Starting Cloudinary upload...');
  const uploadtocloudinary=()=>{
    return new Promise((resolve,reject)=>{
      const stream=cloudinary.uploader.upload_stream(
        {folder:"HMS"},
        (err,result)=>{
          if(err) {
            console.error('Cloudinary upload error:', err);
            reject(err)
          }
          else {
            console.log('Cloudinary upload success:', result);
            resolve(result)
          }
        }
      )
      stream.end(req.file.buffer);
    })
  }

  const uploadedfile= await uploadtocloudinary()
  return res.status(200).json({
    message: "File uploaded successfully",
    url:  uploadedfile.secure_url,
    public_id: uploadedfile.public_id,
  })

} 
catch (error) {
  console.error('Upload controller error:', error);
  res.status(500).json({ message: error.message });  
}
}

// delete image
static async deleteFile(req,res){
try {
  console.log('Delete request received');
  console.log('Public ID:', req.body.public_id);
  const {public_id}= req.body;
  if(!public_id){
return res.status(400).json({message:"Public ID is required"})
  }
  await cloudinary.uploader.destroy(public_id)
    return res.status(200).json({message:"File deleted successfully"})
} 
catch (error) {
    res.status(500).json({ message: error.message });
}
}
}

export default uploadController