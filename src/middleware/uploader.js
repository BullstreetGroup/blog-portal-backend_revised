// src/middleware/uploader.js
import multer from 'multer';
import path from 'path';
import { s3 } from './s3Client.js'; // Ensure this import path is correct
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { handleError, handleResponse } from '../utils/requestHandlers.js';

const storage = multer.memoryStorage(); // Use memory storage to handle the file in-memory

const uploader = multer({
  storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname);
    if (
      ext !== '.png' &&
      ext !== '.jpg' &&
      ext !== '.jpeg' &&
      ext !== '.pdf' &&
      ext !== '.PNG' &&
      ext !== '.JPG' &&
      ext !== '.JPEG' &&
      ext !== '.PDF'
    ) {
      return callback(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
    callback(null, true);
  },
}).any();

export const uploaderMiddleware = (req, res, next) => {
  uploader(req, res, function (err) {
    if (err) {
      return handleError({ res, statusCode: 400, error: err.message });
    }
    next();
  });
};

export const upload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error('No files uploaded');
    }

    // Array to store URLs of uploaded files
    const uploadedUrls = await Promise.all(req.files.map(async (file) => {
      const params = {
        Bucket: 'bullstreetblog', // Replace with your S3 bucket name
        Key: `uploads/${Date.now()}_${file.originalname}`, // File name in S3
        Body: file.buffer, // File buffer from Multer
        ContentType: file.mimetype, // MIME type of the file
        ACL: 'public-read', // Optional: Set the file as publicly readable
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      // Return the URL of the uploaded file
      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    }));

    handleResponse({ res, data: { urls: uploadedUrls } });
  } catch (err) {
    handleError({ res, statusCode: 500, error: err.message });
  }
};
