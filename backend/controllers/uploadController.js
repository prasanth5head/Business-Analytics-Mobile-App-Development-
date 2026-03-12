const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File validation
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpg, png) and PDFs are allowed'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});

// @desc    Upload a file
// @route   POST /api/upload
// @access  Private
const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const file = await File.create({
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileUrl: `/uploads/${req.file.filename}`,
            uploadedBy: req.user._id,
        });

        res.status(201).json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { upload, uploadFile };
