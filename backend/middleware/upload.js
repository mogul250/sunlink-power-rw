import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024;

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const createUploadDirs = () => {
  const dirs = [
    uploadDir,
    path.join(uploadDir, 'products'),
    path.join(uploadDir, 'categories'),
    path.join(uploadDir, 'testimonials'),
    path.join(uploadDir, 'kits'),
    path.join(uploadDir, 'manuals'),
    path.join(uploadDir, 'resources'),
    path.join(uploadDir, 'projects')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'products';
    
    // Determine folder based on file type or request path
    if (req.originalUrl.includes('/projects')) {
      folder = 'projects';
    } else if (req.originalUrl.includes('category') || req.originalUrl.includes('categories')) {
      folder = 'categories';
    } else if (req.originalUrl.includes('kits')) {
      folder = 'kits';
    } else if (req.originalUrl.includes('testimonial') || req.originalUrl.includes('testimonials')) {
      folder = 'testimonials';
    } else if (req.originalUrl.includes('resources')) {
      folder = 'resources';
    } else if (file.mimetype === 'application/pdf') {
      folder = 'manuals';
    }
    
    cb(null, path.join(uploadDir, folder));
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images and common document types
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedDocumentTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  const extension = extname.slice(1);
  const allowedDocumentMimeTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ]);

  // Check if it's an image
  if (allowedImageTypes.test(extension) && mimetype.startsWith('image/')) {
    cb(null, true);
  }
  // Check if it's an allowed document
  else if (allowedDocumentTypes.test(extension) && allowedDocumentMimeTypes.has(mimetype)) {
    cb(null, true);
  }
  // Reject file
  else {
    cb(new Error('Only images and common document files (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT) are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || DEFAULT_MAX_FILE_SIZE // 100MB default
  },
  fileFilter: fileFilter
});

const uploadProjectFiles = multer({
 storage, limits: { fileSize: 10 * 1024 * 1024, files: 11 },
 fileFilter: (req, file, cb) => {
 const valid = /\.(jpe?g|png|webp|gif)$/i.test(file.originalname) && /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype);
 cb(valid ? null : new Error('Project uploads must be JPG, PNG, WebP or GIF images'), valid);
 }
}).fields([{ name: 'image', maxCount: 1 }, { name: 'gallery_images', maxCount: 10 }]);
// Middleware for single image upload
const uploadSingleImage = upload.single('image');

// Middleware for single PDF upload
const uploadSinglePDF = upload.single('pdf');

// Middleware for multiple images
const uploadMultipleImages = upload.array('images', 5);

// Middleware for product with image and manual
const uploadProductFiles = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'manual', maxCount: 1 },
  { name: 'gallery_images', maxCount: 10 }
]);

// Middleware for testimonial with images and video
const uploadTestimonialFiles = upload.fields([
  { name: 'before_image', maxCount: 1 },
  { name: 'after_image', maxCount: 1 }
]);

// Middleware for kit with main image and gallery images
const uploadKitFiles = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery_images', maxCount: 10 }
]);

// Middleware for generic resources
const uploadResourceFiles = upload.fields([
  { name: 'files', maxCount: 20 }
]);

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxFileSizeMb = req.originalUrl.includes('/projects') ? 10 : Math.round((parseInt(process.env.MAX_FILE_SIZE, 10) || DEFAULT_MAX_FILE_SIZE) / (1024 * 1024));
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum size is ${maxFileSizeMb}MB.`
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

export {
  uploadProjectFiles,
  uploadSingleImage,
  uploadSinglePDF,
  uploadMultipleImages,
  uploadProductFiles,
  uploadTestimonialFiles,
  uploadKitFiles,
  uploadResourceFiles,
  handleUploadError
};
