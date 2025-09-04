# 💬 Chat-ify - Real-Time Messaging Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-blue?style=for-the-badge)](https://chat-ify.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

A modern, full-stack real-time messaging application built with the MERN stack, featuring instant messaging, friend management, and a beautiful responsive UI with multiple theme options.

## 👨‍💻 Author

- GitHub: [@KatrielMoses](https://github.com/KatrielMoses)
- LinkedIn: [Katriel Delzyn Moses](https://linkedin.com/in/katriel-moses/)
- Email: katriel.moses@gmail.com
## ✨ Features

### 🔐 **Authentication & Security**
- Secure user registration and login system
- JWT-based authentication with HTTP-only cookies
- Password hashing using bcrypt.js
- Protected routes and middleware validation
- Input validation and error handling

### 💬 **Real-Time Messaging**
- Instant message delivery using Socket.IO
- One-on-one private conversations
- Image sharing with Cloudinary integration
- Message history persistence
- Real-time typing indicators
- Message timestamps

### 👥 **User Management**
- Friend system with add/remove functionality
- Online/offline user presence indicators
- User profiles with customizable avatars
- User search and discovery

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Multiple theme options (8+ themes)
- Beautiful animations and transitions
- Intuitive chat interface
- Loading skeletons for better UX
- Toast notifications for user feedback

### ⚡ **Performance & Scalability**
- Optimized database queries with MongoDB indexing
- Efficient state management with Zustand
- Image optimization and CDN delivery
- Component-based architecture
- Code splitting and lazy loading

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JSON Web Tokens** - Secure authentication
- **bcrypt.js** - Password hashing
- **Cloudinary** - Media management and optimization
- **Cookie Parser** - Cookie handling middleware
- **CORS** - Cross-origin resource sharing

## 🌟 Screenshots
<img width="1830" height="876" alt="signup" src="https://github.com/user-attachments/assets/f16f2d9a-973f-4dcb-9023-f26262bc9ece" />
<img width="1667" height="891" alt="chat" src="https://github.com/user-attachments/assets/256dcee0-1490-4886-9f1b-59e74ead4f31" />
<img width="525" height="295" alt="friend request" src="https://github.com/user-attachments/assets/83fabf14-de28-4353-92f7-16a54405fbd5" />
<img width="345" height="233" alt="notifications" src="https://github.com/user-attachments/assets/0144a951-ff77-49d8-ab9b-fcef7e51b6ee" />
## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account for image uploads

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chat-ify.git
   cd chat-ify
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the development servers**
   
   Backend (from backend directory):
   ```bash
   npm run dev
   ```
   
   Frontend (from frontend directory):
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

### Build for Production

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd ../backend
   npm start
   ```

## 📁 Project Structure

```
chat-ify/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── lib/           # Utilities and configs
│   │   └── index.js       # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand stores
│   │   ├── lib/          # Utilities and configs
│   │   └── App.jsx       # Main app component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### Messages
- `GET /api/messages/users` - Get all users for sidebar
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user

### Friends
- `GET /api/friends` - Get user's friends
- `POST /api/friends/add` - Send friend request
- `POST /api/friends/accept/:id` - Accept friend request
- `DELETE /api/friends/remove/:id` - Remove friend

## 🎯 Key Features Implementation

### Real-Time Communication
```javascript
// Socket.IO implementation for instant messaging
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  userSocketMap[userId] = socket.id;
  
  // Broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
```

### State Management
```javascript
// Zustand store for chat functionality
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  // ... other state and actions
}));
```

### Authentication Middleware
```javascript
// JWT verification middleware
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
```

## 🚀 Deployment

This application is deployed on Vercel. You can access the live demo at [Chat-ify](https://chat-ify.vercel.app/)

### Deploy to Render

1. Fork this repository
2. Connect your GitHub account to Render
3. Create a new Web Service
4. Configure environment variables
5. Deploy!

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- Cloudinary for media management
- Tailwind CSS for beautiful styling
- DaisyUI for UI components
- MongoDB for database solutions

---

⭐ Star this repository if you found it helpful!
