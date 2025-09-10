# InsightX - Marketing Management Platform

A comprehensive full-stack web application for managing marketing activities, forms, stock requests, and team collaboration. Built with React, Node.js, Express, and MongoDB.

## 🚀 Live Demo

- **Frontend**: [https://insightx-ten.vercel.app](https://insightx-ten.vercel.app)
- **Backend API**: [https://insightx-ya2k.onrender.com](https://insightx-ya2k.onrender.com)
- **API Documentation**: [https://insightx-ya2k.onrender.com/api-docs](https://insightx-ya2k.onrender.com/api-docs)

## 🔐 Demo Login Credentials

**Email**: `victorybalogun@gmail.com`  
**Password**: `Password123`

## 📸 Screenshots

### Dashboard Overview
![Dashboard](/src/assets/screenshots/dashboard.png)
*Main dashboard showing key metrics, recent activities, and quick access to features*

### Forms Management
![Forms](/src/assets/screenshots/forms.png)
*Form builder interface with drag-and-drop functionality for creating custom forms*

### Authentication
![Login](/src/assets/screenshots/login.png)
*Clean and modern login interface with Google OAuth and traditional email/password options*

## ✨ Features

### 🎯 Core Functionality
- **Dashboard Analytics** - Real-time insights and metrics
- **Form Builder** - Drag-and-drop form creation with multiple field types
- **Activity Management** - Track marketing campaigns and events
- **Stock Request System** - Manage inventory and procurement requests
- **User Management** - Role-based access control (Admin, Member, Agent)
- **Real-time Notifications** - Socket.io powered live updates

### 🔐 Authentication
- **Google OAuth Integration** - Seamless login with Google accounts
- **Traditional Email/Password** - Fallback authentication system
- **JWT Token Management** - Secure session handling
- **Role-based Permissions** - Different access levels for different users

### 📊 Advanced Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - User preference theme switching
- **File Upload Support** - Handle document and image uploads
- **Email Notifications** - Automated email alerts
- **SMS Integration** - Twilio-powered SMS notifications
- **API Documentation** - Interactive Swagger UI documentation

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Token authentication
- **Socket.io** - Real-time bidirectional communication
- **Swagger** - API documentation
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Twilio** - SMS services

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend API hosting
- **MongoDB Atlas** - Cloud database

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/insightx-webb.git
   cd insightx-webb
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd insightx-api
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `insightx-api` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_phone
   BASE_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:5173
   ```

5. **Run the development servers**
   
   Backend (from `insightx-api` directory):
   ```bash
   npm run dev
   ```
   
   Frontend (from root directory):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

## 📁 Project Structure

```
insightx-webb/
├── src/                          # Frontend source code
│   ├── components/              # Reusable UI components
│   │   ├── common/             # Common components
│   │   ├── features/           # Feature-specific components
│   │   └── ui/                 # UI component library
│   ├── pages/                  # Page components
│   ├── context/                # React context providers
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # API service functions
│   └── utils/                  # Utility functions
├── insightx-api/               # Backend API
│   ├── controllers/            # Route controllers
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── config/                 # Configuration files
│   ├── utils/                  # Utility functions
│   └── swagger/                # API documentation
└── public/                     # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Traditional login
- `GET /api/auth/google` - Google OAuth login
- `POST /api/auth/register` - User registration (Admin only)

### Forms
- `GET /api/forms` - Get all forms
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity

### Stock Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request status

*For complete API documentation, visit the [Swagger UI](https://insightx-ya2k.onrender.com/api-docs)*

## 🎨 Key Features in Detail

### Form Builder
- Drag-and-drop interface for creating custom forms
- Multiple field types: text, number, date, file upload, dropdown, etc.
- Form validation and conditional logic
- Public form sharing with unique URLs
- Response collection and analytics

### Activity Management
- Create and track marketing activities
- Assign team members and set deadlines
- Real-time status updates
- File attachments and comments
- Progress tracking and reporting

### User Roles
- **Admin**: Full system access, user management, system settings
- **Member**: Create activities, forms, and requests
- **Agent**: Limited access for form submissions and basic operations

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Role-based access control
- Secure session management

## 🚀 Deployment

The application is deployed using:
- **Frontend**: Vercel (automatic deployments from GitHub)
- **Backend**: Render (automatic deployments from GitHub)
- **Database**: MongoDB Atlas (cloud-hosted)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Victory Balogun**
- Email: victorybalogun@gmail.com
- LinkedIn: www.linkedin.com/in/victory-omowumi-b-1465a9101
- GitHub: [[Your GitHub Profile]](https://github.com/VictoryOmowumi/)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vercel and Render for hosting services
- MongoDB for the database solution
- All open-source contributors whose packages made this project possible

---

**Note**: This is a portfolio project demonstrating full-stack development skills with modern technologies. Feel free to explore the live demo and check out the source code!
