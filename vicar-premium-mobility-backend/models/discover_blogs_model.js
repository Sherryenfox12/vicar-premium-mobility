const mongoose = require('mongoose');

const discoverBlogsSchema = new mongoose.Schema({
    title: {
        en: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        zh: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        }
    },
    summary: {
        en: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        zh: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        }
    },
    body: {
        en: {
            type: String,
            required: true,
            trim: true
        },
        zh: {
            type: String,
            required: true,
            trim: true
        }
    },
    linkto: {
        type: String,
        trim: true,
        default: ''
    },
    mediaurl: {
        type: String,
        trim: true,
        default: ''
    },
    createdby: {
        type: Date,
        default: Date.now
    },
    lastmodify: {
        type: Date,
        default: Date.now
    }
}, { 
    collection: 'DiscoverBlogsList',
    timestamps: false // We're using custom timestamp fields
});

// Update lastmodify timestamp before saving
discoverBlogsSchema.pre('save', function(next) {
    this.lastmodify = new Date();
    next();
});

// Update lastmodify timestamp before updating
discoverBlogsSchema.pre('findOneAndUpdate', function(next) {
    this.set({ lastmodify: new Date() });
    next();
});

const DiscoverBlogsModel = mongoose.model('DiscoverBlogsList', discoverBlogsSchema);

module.exports = DiscoverBlogsModel;
