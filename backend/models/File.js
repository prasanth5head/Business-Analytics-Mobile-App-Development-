const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    fileName: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
