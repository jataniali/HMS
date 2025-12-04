import express from 'express'
import {verifytoken,verifyrole} from '../middlewares/authmidlware.js';
import uploadController,{upload} from '../controllers/uploadcontroller.js';

const router= express.Router()
router.use(verifytoken)

// Test Cloudinary configuration
router.get('/test-cloudinary', (req, res) => {
  try {
    console.log('Cloudinary config test');
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key exists:', !!process.env.CLOUDINARY_API_KEY);
    console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);
    
    res.json({
      message: 'Cloudinary config loaded',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/single', (req, res, next) => {
  console.log('Upload route hit');
  next();
}, upload.single("image"), uploadController.uploadFile)
router.delete('/delete', uploadController.deleteFile)

export default router