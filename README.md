# BlogHub — Premium Blogging Platform (MERN Stack)

A modern, responsive, and aesthetically stunning blogging platform inspired by Medium. Built with React (Vite), Node.js, Express, and MongoDB.
## Live Demo: https://blog-platform-navyan.vercel.app/

## Features

- **Authentication & User Profiles**: Secure JWT-based registration and login. Customized user bio and name updates.
- **Article Writing & Publishing**: Fully functional editor for blog posts, tags management, and cover image support.
- **Read & Explore Feed**: Fast home feed with smart search query filter and tag-based categorization.
- **Interactive Actions**: Like/unlike toggles on articles and comments section support for user interactions.
- **Clean Design System**: Beautiful custom warm editorial design with emerald/teal accents, responsive layouts, glassmorphism overlays, and dark/light modes.

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS (Warm Editorial & Glassmorphism Theme)
- **Routing**: React Router DOM v6
- **Notifications**: React Hot Toast
- **Icons**: React Icons
- **Date Handling**: date-fns

### Backend
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Security**: JWT & bcryptjs password hashing
- **Middleware**: CORS, Express JSON parser, protection guard middleware

---

## Getting Started

### Prerequisites
- Node.js installed
- Active MongoDB Atlas Cluster or Local MongoDB running

### Installation

1. Clone or open the project folder:
   ```bash
   cd 2-blog-platform
   ```

2. Set up Backend:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file inside the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blogplatform
   JWT_SECRET=your_jwt_secret_key
   ```

3. Set up Frontend:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file inside the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running Locally

1. Start backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.
