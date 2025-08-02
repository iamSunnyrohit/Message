# Chat Application

A real-time chat application built with React, Node.js, Express, Socket.IO, and MongoDB.

## Project Structure

```
/chat-app
├── /client                 # React frontend
│   ├── /public
│   ├── /src
│   │   ├── /assets
│   │   ├── /components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── UserSearch.jsx
│   │   │   └── LoginForm.jsx
│   │   ├── /contexts
│   │   │   └── AuthContext.js
│   │   ├── /hooks
│   │   │   └── useSocket.js
│   │   ├── /pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Chat.jsx
│   │   ├── App.js
│   │   ├── index.js
│   │   └── api.js           # Axios instance
│   └── package.json

├── /server                 # Express backend
│   ├── /controllers
│   │   ├── authController.js
│   │   └── messageController.js
│   ├── /models
│   │   ├── User.js
│   │   └── Message.js
│   ├── /routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── messageRoutes.js
│   ├── /middlewares
│   │   └── authMiddleware.js
│   ├── /socket
│   │   └── index.js         # Socket.IO setup
│   ├── .env
│   ├── server.js            # Entry point
│   └── package.json

├── README.md
└── .gitignore
```

## Features

- **Real-time messaging** using Socket.IO
- **User authentication** with JWT tokens
- **User search** functionality
- **Online/offline status** tracking
- **Message read status** indicators
- **Typing indicators** in real-time
- **Responsive design** with Tailwind CSS

## Tech Stack

### Frontend
- React 19
- Socket.IO Client
- Axios for API calls
- Tailwind CSS for styling

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the development servers**

   In the server directory:
   ```bash
   npm run dev
   ```

   In the client directory (new terminal):
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:userId` - Get specific user (protected)

### Messages
- `POST /api/messages` - Send a message (protected)
- `GET /api/messages/:userId` - Get messages with user (protected)
- `PUT /api/messages/:messageId/read` - Mark message as read (protected)
- `GET /api/messages/unread/count` - Get unread count (protected)

## Socket.IO Events

### Client to Server
- `send_message` - Send a private message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing

### Server to Client
- `new_message` - Receive a new message
- `message_sent` - Confirm message sent
- `user_online` - User came online
- `user_offline` - User went offline
- `user_typing` - User is typing
- `user_stopped_typing` - User stopped typing

## Development

### Running in Development Mode
- Server runs on `http://localhost:5000`
- Client runs on `http://localhost:3000`

### Building for Production
```bash
# Build client
cd client
npm run build

# Start server in production
cd ../server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
