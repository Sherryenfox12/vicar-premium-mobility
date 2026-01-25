# Vicar Premium Mobility System

==========================----Overview----=============================

## Overview
The Vicar Premium Mobility System is a comprehensive premium mobility ecosystem designed to deliver exceptional experiences through luxury, innovation, and personalized service. Built on five core principles — V (Vehicle) · i (Intelligence) · C (Care) · A (Access) · R (Reliability) — the system provides a unified platform for luxury car rental, premium chauffeur services, reconditioned vehicles, electric vehicles, and comprehensive automotive services. The platform features an immersive 3D experience, bilingual support (English/Chinese), blog management, and comprehensive vehicle showcase capabilities, all integrated into one seamless digital ecosystem.

## Features
### Customer Functions
- Browse premium reconditioned vehicles with 3D model visualization
- View detailed vehicle specifications and information
- Access bilingual content (English/Chinese)
- Read blog posts about car maintenance and industry insights
- Submit contact forms for inquiries
- Experience smooth animations and transitions

### Admin Functions
- Login with secure authentication (24-hour session expiry)
- Create and manage blog posts with bilingual content
- Upload and manage media files (images, videos)
- Manage banner media for different pages
- View and respond to customer inquiries
- Update vehicle information and specifications

### Technologies Used
MERN Stack + Vite
- React.js 19
- Vite (Build Tool)
- Node.js
- Express.js
- MongoDB
- Three.js (3D Models)

==========================----Backend----=============================

## Installation & Setup

### Backend
### Technologies Used
- Node.js
- Express.js
- MongoDB
- Multer (File Uploads)
- JWT (Authentication)


1. Clone the repository.
2. Navigate to the backend directory and install dependencies (npm install)
3. Start the server with env: node --env-file=.env vicar-premium-mobility-backend.js
4. You should see the server hosted at PORT 82: http://localhost:82

==========================----Frontend----=============================
### Frontend
### Technologies Used
- React.js 19
- Vite (Build Tool)
- Three.js (3D Models)
- Framer Motion (Animations)
- Tailwind CSS

The path point to backend is included in env file, the backend will by default host on localhost:82, 
if the backend was host on different server or different port, please edit the frontend env:

1. Navigate to the frontend directory and install dependencies
2. Start the frontend application by npm run dev(development) or npm run preview(production)

The customer module starting point should be:
http://localhost:5174

The admin module should be
http://localhost:5174/admin/login
then it will navigate you to the adminDashboard.

#Please use these test credential for admin login to view dashboard:
username: admin
password: admin

### Development Server Configuration
The Vite config includes:
- Host access for external connections (ngrok compatibility)
- Video file caching optimization
- Asset handling for better performance
- Development server runs on PORT 5174
- Production build serves on PORT 4174

==========================----Author----=============================

**Created by:** Cheng Xin Ying  
**Last Modified Date:** 18/09/2025  
**Email:** sherryencheng97@gmail.com  
**Phone:** 016-4365084
