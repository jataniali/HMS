import API from './axios';

const uploadAPI = {
  // Upload single file
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('Uploading file:', file.name);
      
      const response = await API.put('/uploads/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload error details:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      throw new Error(errorMessage);
    }
  },

  // Delete file
  deleteFile: async (publicId) => {
    try {
      const response = await API.delete('/uploads/delete', {
        data: { public_id: publicId }
      });
      return response.data;
    } catch (error) {
      console.error('Delete error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
      throw new Error(errorMessage);
    }
  }
};

export default uploadAPI;
