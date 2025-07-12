# 🍽️ Food Rescue - Connecting Donors with Recipients

## 🌟 Overview

Food Rescue is a web application designed to reduce food waste by connecting food donors with recipients through a network of volunteers. The platform provides role-based dashboards for efficient food donation management and community coordination.

## 🌐 Live Demo

👉 [View Deployed App](https://your-deployed-link.com)

---

### ✅ **Features**

#### 🔐 Authentication System
- User registration with email verification
- Login/logout with JWT tokens
- Password reset functionality
- Role-based access control (Admin, Donor, Recipient, Volunteer)


#### 🎨 UI Framework & Design
- Material-UI (MUI) components throughout
- Responsive design for all device sizes
- Consistent theming and styling
- Navigation and routing system

#### 🔧 Backend Infrastructure
- Express.js server with middleware
- MongoDB database with Mongoose schemas
- JWT authentication middleware
- Cloudinary integration for image uploads
- Socket.IO configuration for real-time features

#### 🛠️ Admin Dashboard 
- **Overview Page**: Real-time statistics and charts
- **Donations Management**: View all donations with donor information
- **User Management**: Approve/reject users, manage user roles
- **Inventory Tracking**: Live food inventory monitoring
- **Analytics**: Data visualization with trends and insights
- **Settings**: System configuration management
- **Real-time Data**: Connected to backend APIs

#### 🤝 Donor Dashboard
-  Dashboard layout and navigation
-  Create donation form with image upload
-  Profile management UI
-  Donation history 
-  Real-time tracking 

#### 🏠 Recipient Dashboard
-  Basic dashboard layout with logout functionality
-  Search page UI structure
-  Profile management interface
-  Feedback form UI
-  Search functionality (backend needed)
-  Request management (API needed)

#### 🚚 Volunteer Dashboard
-  Dashboard layout and navigation
-  Available tasks UI structure
-  Profile management interface
-  Task assignment system (mock data only)
-  Map integration (placeholder)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Material-UI (MUI)** - Component library and theming
- **React Router** - Client-side routing with role protection
- **Axios** - HTTP client for API communication
- **Chart.js & Recharts** - Data visualization
- **Socket.IO Client** - Real-time communication setup
- **Vite** - Build tool and development server

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication token management
- **Bcrypt.js** - Password hashing
- **Cloudinary** - Image storage and management
- **Socket.IO** - Real-time communication framework
- **Nodemailer** - Email service integration

### Development Tools
- **ESLint** - Code linting and formatting
- **dotenv** - Environment variable management

## 📁 Project Structure

```
food-rescue/
├── 📁 backend/
│   ├── 📁 controller/
│   │   ├── adminController.js      
│   │   ├── authController.js       
│   │   ├── donationController.js    
│   │   └── userController.js       
│   ├── 📁 middleware/
│   │   ├── authMiddleware.js       
│   │   └── upload.js               
│   ├── 📁 models/
│   │   ├── Donation.js             
│   │   ├── user.js                 
│   │   ├── Task.js                 
│   │   ├── Setting.js             
│   │   └── Notification.js        
│   ├── 📁 routes/
│   │   ├── adminRoutes.js          
│   │   ├── authRoutes.js           
│   │   └── donationRoutes.js       
│   └── server.js                   
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── 📁 dashboard/
│   │   │   │   ├── 📁 admin/        
│   │   │   │   ├── 📁 donor/       
│   │   │   │   ├── 📁 Recipient/    
│   │   │   │   └── 📁 volunteer/    
│   │   │   ├── Home.jsx             
│   │   │   ├── SignIn.jsx           
│   │   │   └── SignUp.jsx           
│   │   ├── 📁 components/
│   │   │   ├── Header.jsx           
│   │   │   ├── Layout.jsx           
│   │   │   └── PrivateRoute.jsx    
│   │   └── 📁 services/
│   │       ├── api.js               
│   │       └── socketService.js    
│   └── package.json
└── README.md


## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Laibanoor92/Food-Rescue.git
cd Food-Rescue
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### 1. Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/food-rescue

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Database Setup

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
1. Create cluster on [MongoDB Atlas](https://cloud.mongodb.com/)
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

## 🏃‍♂️ Usage

### Development Mode

#### 1. Start Backend Server
```bash
cd backend
npm start
```
Server runs on `http://localhost:5000`

#### 2. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### User Accounts

To test the application, create accounts with different roles:

- **Donor**: Food donation management
- **Recipient**: Browse and request donations
- **Volunteer**: Delivery task management

## 📚 API Documentation

### Implemented Endpoints

#### Authentication 
- `POST /api/auth/signup` - User registration with email verification
- `POST /api/auth/signin` - User login with JWT token
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/auth/verify/:token` - Email verification

#### Admin Routes 
- `GET /api/admin/overview/summary` - Dashboard statistics
- `GET /api/admin/donations` - All donations with populated donor info
- `GET /api/admin/users` - User management data
- `PUT /api/admin/users/:id/approve` - Approve user registration
- `GET /api/admin/inventory/live` - Live inventory tracking
- `GET /api/admin/analytics/trends` - Analytics and reporting data
- `GET /api/admin/settings` - System settings
- `PUT /api/admin/settings` - Update system settings

#### Donations 
- `GET /api/donations/stats` - Donor dashboard statistics
- `POST /api/donations` - Create new donation (with Cloudinary upload)

#### Users 
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🚧 Development Roadmap

### Phase 1: Complete Core Features 
- [ ] Complete donor dashboard API integration
- [ ] Implement recipient search and request functionality
- [ ] Finish donation tracking system
- [ ] Add comprehensive error handling

### Phase 2: Volunteer System
- [ ] Task assignment and management
- [ ] Real-time location tracking
- [ ] Route optimization
- [ ] Communication system

### Phase 3: Advanced Features
- [ ] Real-time notifications with Socket.IO
- [ ] Google Maps integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app development

### Phase 4: Production Ready
- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment automation


### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Guidelines
- Follow existing code style and conventions
- Test your changes thoroughly
- Update documentation as needed
- Focus on completing partially implemented features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for detail.


## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/mshiveshm/Food-Rescue/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/mshiveshm/Food-Rescue/discussions)

## 🎯 Project Vision

### Current State
A functional food rescue platform with a complete admin dashboard, donor/recipient/Volunteer features, and a solid foundation for real-time food donation management.

### Future Goals
- Scale to handle multiple cities and regions
- Mobile application for better accessibility
- Integration with food safety regulations
- Partnerships with local food banks and restaurants

---

**Made with ❤️ for reducing food waste and helping communities**
