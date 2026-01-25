//node vicar-premium-mobility-backend.js


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const app = express();



// Middleware
app.use(helmet()); 
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.options("*", cors());

app.use(morgan('combined'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// Get port from environment variables
const PORT = process.env.PORT || 82;




// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ViCAR Premium Mobility Backend API',
    status: 'Server is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});


// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

///Database configuration
const UserModel = require('./models/user_model');
const DiscoverBlogsModel = require('./models/discover_blogs_model');
const BannerMediaModel = require('./models/banner_media_model');


//Connect to mongoDB database
const decodedMongoLink = Buffer.from(process.env.DB_MONGO_LINK, 'base64').toString('utf-8');

mongoose.connect(decodedMongoLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log("Connected to mongoDB ViCAR_PremiumMobility");
})
    .catch((error) => console.log("Error connect to mongoDB ViCAR_PremiumMobility", error));


///////////////////////////////////////-----ADMIN Account-----///////////////////////////////////////

//Create new user
app.post('/api/createAccount', async (req, res) => {
    try {
        
        const { username, password, email, role, firstName, lastName, phoneNumber } = req.body;

        const encodedUsername = Buffer.from(username, 'utf-8').toString('base64');
        const encodedPassword = Buffer.from(password, 'utf-8').toString('base64');

        const existingUser = await UserModel.findOne({ username: encodedUsername });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        const newUser = new UserModel({
            username: encodedUsername,
            password: encodedPassword, 
            email,
            role,
            firstName,
            lastName,
            phoneNumber,
            createdByDate: new Date(),
            lastModifiedDate: new Date(),
        });

        //Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.log('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});


//Admin login - Plain text password comparison only
app.post('/api/adminLogin', async (req, res) => {
  console.log("Admin login");
    const { username, password } = req.body;

    try {
        // Username is already base64 encoded in database, so search directly
        console.log("Searching for username:", username);
        
        const user = await UserModel.findOne({ username: username });
        console.log("Found user:", user ? "Yes" : "No");
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        //Create jwt token, expired after 24 hours and need to relogin
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        phoneNumber: user.phoneNumber,
                        firstName: user.firstName,
                        lastName: user.lastName
                    },
                });
            }
        )
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});



///////////////////////////////////////-----Car-----///////////////////////////////////////
// API routes
app.get('/api/cars', (req, res) => {
  res.json({
    message: 'Cars endpoint - Ready for implementation',
    data: []
  });
});

app.get('/api/deals', (req, res) => {
  res.json({
    message: 'Deals endpoint - Ready for implementation',
    data: []
  });
});

///////////////////////////////////////-----Media Management-----///////////////////////////////////////


// Media handling configuration
const mediaDir = path.join(__dirname, 'vicar_data', 'media');

// Ensure media directory exists
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mediaDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
  
  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // 50MB limit
    fileSize: 50 * 1024 * 1024 
  }
});

// Serve static files from media directory with CORS headers
app.use('/vicar_data/media', (req, res, next) => {
  // Set CORS headers for static files
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}, express.static(mediaDir));



// Upload single media file
app.post('/api/upload-media', upload.single('media'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/vicar_data/media/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload multiple media files
app.post('/api/upload-multiple-media', upload.array('media', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `${req.protocol}://${req.get('host')}/vicar_data/media/${file.filename}`
    }));

    res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Get list of all media files
app.get('/api/media', (req, res) => {
  try {
    fs.readdir(mediaDir, (err, files) => {
      if (err) {
        console.error('Error reading media directory:', err);
        return res.status(500).json({ error: 'Failed to read media directory' });
      }

      const mediaFiles = files.map(filename => {
        const filePath = path.join(mediaDir, filename);
        const stats = fs.statSync(filePath);
        const ext = path.extname(filename).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        const isVideo = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'].includes(ext);

        return {
          filename,
          url: `${req.protocol}://${req.get('host')}/vicar_data/media/${filename}`,
          size: stats.size,
          type: isImage ? 'image' : isVideo ? 'video' : 'unknown',
          uploadDate: stats.mtime
        };
      });

      res.json({
        success: true,
        count: mediaFiles.length,
        files: mediaFiles
      });
    });
  } catch (error) {
    console.error('Error getting media list:', error);
    res.status(500).json({ error: 'Failed to get media list' });
  }
});

// Delete a media file
app.delete('/api/media/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(mediaDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

///////////////////////////////////////-----Banner Media Management-----///////////////////////////////////////
// Configure multer for banner media uploads
const bannerMediaDir = path.join(__dirname, 'vicar_data', 'media', 'banner-media');

// Ensure banner media directory exists
if (!fs.existsSync(bannerMediaDir)) {
  fs.mkdirSync(bannerMediaDir, { recursive: true });
}

// Configure multer for banner media uploads
const bannerMediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, bannerMediaDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with page and slot info
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `banner-${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const bannerMediaUpload = multer({ 
  storage: bannerMediaStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Serve static files from banner media directory with CORS headers
app.use('/vicar_data/media/banner-media', (req, res, next) => {
  // Set CORS headers for static files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}, express.static(bannerMediaDir));

// Save banner media to MongoDB
app.post('/api/save-banner-media', bannerMediaUpload.single('media'), async (req, res) => {
  try {
    const { page, slotIndex } = req.body;

    // Validate required fields
    if (!page || slotIndex === undefined || !req.file) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Page, slotIndex, and media file are required'
      });
    }

    // Validate page value
    const validPages = ['home', 'aboutUs', 'ourService', 'discover', 'contactUs'];
    if (!validPages.includes(page)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid page',
        message: 'Page must be one of: home, aboutUs, ourService, discover, contactUs'
      });
    }

    // Validate slotIndex
    const slotIndexNum = parseInt(slotIndex);
    const maxSlots = page === 'home' ? 5 : 1;
    if (isNaN(slotIndexNum) || slotIndexNum < 0 || slotIndexNum >= maxSlots) {
      return res.status(400).json({
        success: false,
        error: 'Invalid slot index',
        message: `Slot index must be between 0 and ${maxSlots - 1} for ${page} page`
      });
    }

    // Generate file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/vicar_data/media/banner-media/${req.file.filename}`;
    
    console.log('📁 File upload details:');
    console.log('- Page:', page);
    console.log('- Slot Index:', slotIndexNum);
    console.log('- Filename:', req.file.filename);
    console.log('- File URL:', fileUrl);
    console.log('- File Size:', req.file.size);
    console.log('- MIME Type:', req.file.mimetype);

    // Check if there's already media in this slot
    const existingMedia = await BannerMediaModel.findOne({ page, slotIndex: slotIndexNum });

    if (existingMedia) {
      // Update existing media
      existingMedia.filename = req.file.filename;
      existingMedia.originalName = req.file.originalname;
      existingMedia.fileSize = req.file.size;
      existingMedia.mimeType = req.file.mimetype;
      existingMedia.url = fileUrl;
      existingMedia.lastModified = new Date();
      existingMedia.isActive = true;

      const updatedMedia = await existingMedia.save();
      
      console.log('✅ Updated existing media in MongoDB:');
      console.log('- Document ID:', updatedMedia._id);
      console.log('- URL saved:', updatedMedia.url);
      console.log('- Filename saved:', updatedMedia.filename);
      
      res.status(200).json({
        success: true,
        message: 'Banner media updated successfully',
        data: updatedMedia
      });
    } else {
      // Create new media entry
      const newBannerMedia = new BannerMediaModel({
        page,
        slotIndex: slotIndexNum,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        url: fileUrl,
        uploadedAt: new Date(),
        lastModified: new Date(),
        isActive: true
      });

      const savedMedia = await newBannerMedia.save();
      
      console.log('✅ Created new media in MongoDB:');
      console.log('- Document ID:', savedMedia._id);
      console.log('- URL saved:', savedMedia.url);
      console.log('- Filename saved:', savedMedia.filename);
      
      res.status(201).json({
        success: true,
        message: 'Banner media saved successfully',
        data: savedMedia
      });
    }
  } catch (error) {
    console.error('Error saving banner media:', error);
    
    // If it's a duplicate key error, handle it gracefully
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry',
        message: 'Media already exists for this page and slot'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to save banner media',
      message: error.message
    });
  }
});

// Get banner media for a specific page
app.post('/api/get-banner-media', async (req, res) => {
  try {
    const { page } = req.body;

    // Validate required fields
    if (!page) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Page is required'
      });
    }

    // Validate page value
    const validPages = ['home', 'aboutUs', 'ourService', 'discover', 'contactUs'];
    if (!validPages.includes(page)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid page',
        message: 'Page must be one of: home, aboutUs, ourService, discover, contactUs'
      });
    }

    // Get all media for the specified page
    const bannerMedia = await BannerMediaModel.find({ 
      page, 
      isActive: true 
    }).sort({ slotIndex: 1 });
    
    console.log(`🔍 Fetching banner media for page: ${page}`);
    console.log(`📊 Found ${bannerMedia.length} media entries in database`);
    bannerMedia.forEach((media, index) => {
      console.log(`- Entry ${index + 1}: Slot ${media.slotIndex}, URL: ${media.url}, Filename: ${media.filename}`);
    });

    // Create array with proper slot structure
    const maxSlots = page === 'home' ? 5 : 1;
    const mediaArray = Array(maxSlots).fill(null);

    bannerMedia.forEach(media => {
      if (media.slotIndex >= 0 && media.slotIndex < maxSlots) {
        mediaArray[media.slotIndex] = {
          id: media._id,
          url: media.url,
          mimeType: media.mimeType,
          size: media.fileSize,
          uploadedAt: media.uploadedAt,
          filename: media.filename,
          originalName: media.originalName,
          thumbnail: media.thumbnail
        };
      }
    });

    res.status(200).json({
      success: true,
      message: 'Banner media retrieved successfully',
      data: mediaArray
    });
  } catch (error) {
    console.error('Error getting banner media:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get banner media',
      message: error.message
    });
  }
});


// Delete banner media
app.post('/api/delete-banner-media', async (req, res) => {
  try {
    const { page, slotIndex } = req.body;

    // Validate required fields
    if (!page || slotIndex === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Page and slotIndex are required'
      });
    }

    // Validate page value
    const validPages = ['home', 'aboutUs', 'ourService', 'discover', 'contactUs'];
    if (!validPages.includes(page)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid page',
        message: 'Page must be one of: home, aboutUs, ourService, discover, contactUs'
      });
    }

    // Validate slotIndex
    const slotIndexNum = parseInt(slotIndex);
    const maxSlots = page === 'home' ? 5 : 1;
    if (isNaN(slotIndexNum) || slotIndexNum < 0 || slotIndexNum >= maxSlots) {
      return res.status(400).json({
        success: false,
        error: 'Invalid slot index',
        message: `Slot index must be between 0 and ${maxSlots - 1} for ${page} page`
      });
    }

    // Find and delete the media
    const deletedMedia = await BannerMediaModel.findOneAndDelete({ 
      page, 
      slotIndex: slotIndexNum 
    });

    if (!deletedMedia) {
      return res.status(404).json({
        success: false,
        error: 'Media not found',
        message: 'No media found for this page and slot'
      });
    }

    // Delete the physical file
    const filePath = path.join(bannerMediaDir, deletedMedia.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      success: true,
      message: 'Banner media deleted successfully',
      data: deletedMedia
    });
  } catch (error) {
    console.error('Error deleting banner media:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete banner media',
      message: error.message
    });
  }
});

///////////////////////////////////////-----Discover Blogs List-----///////////////////////////////////////
// Load all blogs
app.post('/api/load-all-blogs', async (req, res) => {
  try {
    const blogs = await DiscoverBlogsModel.find({}).sort({ createdby: -1 });
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch blogs',
      message: error.message 
    });
  }
});

// Load single blog by ID
app.get('/api/load-single-blogs/:id', async (req, res) => {
  try {
    const blog = await DiscoverBlogsModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ 
        success: false,
        error: 'Blog not found' 
      });
    }
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch blog',
      message: error.message 
    });
  }
});

// Create new blog
app.post('/api/create-blogs', async (req, res) => {
  try {
    const { title, summary, body, linkto, mediaurl } = req.body;

    // Validate required fields - now expecting bilingual structure
    if (!title || !summary || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Title, summary, and body are required for both languages'
      });
    }

    // Validate bilingual structure
    if (!title.en || !title.zh || !summary.en || !summary.zh || !body.en || !body.zh) {
      return res.status(400).json({
        success: false,
        error: 'Incomplete bilingual content',
        message: 'Both English and Chinese versions are required for title, summary, and body'
      });
    }

    const newBlog = new DiscoverBlogsModel({
      title: {
        en: title.en,
        zh: title.zh
      },
      summary: {
        en: summary.en,
        zh: summary.zh
      },
      body: {
        en: body.en,
        zh: body.zh
      },
      linkto: linkto || '',
      mediaurl: mediaurl || '',
      createdby: new Date(),
      lastmodify: new Date()
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: savedBlog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create blog',
      message: error.message 
    });
  }
});

// Update blog
app.put('/api/update-blogs/:id', async (req, res) => {
  try {
    const { title, summary, body, linkto, mediaurl } = req.body;

    // Validate required fields - now expecting bilingual structure
    if (!title || !summary || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Title, summary, and body are required for both languages'
      });
    }

    // Validate bilingual structure
    if (!title.en || !title.zh || !summary.en || !summary.zh || !body.en || !body.zh) {
      return res.status(400).json({
        success: false,
        error: 'Incomplete bilingual content',
        message: 'Both English and Chinese versions are required for title, summary, and body'
      });
    }

    const updatedBlog = await DiscoverBlogsModel.findByIdAndUpdate(
      req.params.id,
      {
        title: {
          en: title.en,
          zh: title.zh
        },
        summary: {
          en: summary.en,
          zh: summary.zh
        },
        body: {
          en: body.en,
          zh: body.zh
        },
        linkto: linkto || '',
        mediaurl: mediaurl || '',
        lastmodify: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ 
        success: false,
        error: 'Blog not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update blog',
      message: error.message 
    });
  }
});

// Delete blog
app.delete('/api/delete-blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await DiscoverBlogsModel.findByIdAndDelete(req.params.id);
    
    if (!deletedBlog) {
      return res.status(404).json({ 
        success: false,
        error: 'Blog not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: deletedBlog
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete blog',
      message: error.message 
    });
  }
});

// Search blogs by title or summary
app.get('/api/search-blogs/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const blogs = await DiscoverBlogsModel.find({
      $or: [
        { 'title.en': { $regex: query, $options: 'i' } },
        { 'title.zh': { $regex: query, $options: 'i' } },
        { 'summary.en': { $regex: query, $options: 'i' } },
        { 'summary.zh': { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdby: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      query: query,
      data: blogs
    });
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to search blogs',
      message: error.message 
    });
  }
});

// Get blogs with pagination
app.get('/api/blogs-page/:page', async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await DiscoverBlogsModel.find({})
      .sort({ createdby: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DiscoverBlogsModel.countDocuments({});

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching paginated blogs:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch blogs',
      message: error.message 
    });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
    return res.status(400).json({ error: 'File upload error' });
  }
  if (error.message === 'Invalid file type. Only images and videos are allowed.') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

///////////////////////////////////////-----Email Enquiry Form-----///////////////////////////////////////

// Rate limiting for spam prevention
// 15 minutes each IP maximum 3/WindowMS
const contactFormLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: {
        error: 'Too many contact form submissions',
        message: 'Please wait 15 minutes before submitting another form'
    },
    standardHeaders: true,
    legacyHeaders: false,
});



// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.KW99_EMAIL_USER,
    pass: Buffer.from(process.env.KW99_EMAIL_PASS, 'base64').toString('utf-8'),
  }
});

// Contact form endpoint
app.post('/api/contact-us-enquiry-form', contactFormLimiter, async (req, res) => {
//app.post('/api/contact-us-enquiry-form', async (req, res) => {
  try {
    const { Name, EmailAdd, PhoneNo, MessageBody } = req.body;

    // Validate required fields
    if (!Name || !EmailAdd || !PhoneNo || !MessageBody) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, EmailAdd, PhoneNo, and MessageBody are required'
      });
    }

    // Additional spam prevention validations
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /viagra/i, /casino/i, /loan/i, /credit/i, /buy.*now/i,
      /free.*money/i, /make.*money/i, /earn.*money/i,
      /click.*here/i, /limited.*time/i, /act.*now/i
    ];

    const combinedText = `${Name} ${EmailAdd} ${PhoneNo} ${MessageBody}`.toLowerCase();
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(combinedText)) {
        return res.status(400).json({
          error: 'Suspicious content detected',
          message: 'Your message contains content that appears to be spam. Please revise and try again.'
        });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(EmailAdd)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Check message length (prevent extremely long messages)
    if (MessageBody.length > 1000) {
      return res.status(400).json({
        error: 'Message too long',
        message: 'Message must be less than 1000 characters'
      });
    }

    // Check for repeated characters (common spam technique)
    const repeatedChars = /(.)\1{4,}/;
    if (repeatedChars.test(MessageBody)) {
      return res.status(400).json({
        error: 'Invalid message content',
        message: 'Message contains too many repeated characters'
      });
    }

    // Email options
    const mailOptions = {
      from: 'runner_kw99@gmail.com',
      to: [process.env.KW99_EMAIL_TARGET],
      //['kw99customerenquiry@gmail.com'], 

      subject: `[ViCAR Enquiry Form] New Contact Form Submission from ${Name}`,
      text: `Name: ${Name}\nEmail: ${EmailAdd}\nPhone: ${PhoneNo}\nMessage: ${MessageBody}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${Name}</p>
        <p><strong>Email:</strong> ${EmailAdd}</p>
        <p><strong>Phone:</strong> ${PhoneNo}</p>
        <p><strong>Message:</strong></p>
        <p>${MessageBody}</p>
      `
    };

    // Send email
    console.log('📧 Attempting to send email...');
    console.log('📤 From:', process.env.KW99_EMAIL_USER);
    console.log('📥 To:', process.env.KW99_EMAIL_USER);
    console.log('📝 Subject:', mailOptions.subject);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📨 Message ID:', result.messageId);

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      error: 'Failed to send email',
      message: 'There was an error processing your request. Please try again later.'
    });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});
