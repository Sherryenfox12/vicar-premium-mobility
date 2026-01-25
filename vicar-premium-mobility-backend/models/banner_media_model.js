const mongoose = require('mongoose');

const BannerMediaSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    enum: ['home', 'aboutUs', 'ourService', 'discover', 'contactUs']
  },
  slotIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 4 // Maximum 5 slots (0-4) for home page
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: null // For video thumbnails
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create compound index to ensure unique combination of page and slotIndex
BannerMediaSchema.index({ page: 1, slotIndex: 1 }, { unique: true });

module.exports = mongoose.model('BannerMediaList', BannerMediaSchema, 'BannerMediaList');
