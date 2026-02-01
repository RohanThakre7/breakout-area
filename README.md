# SocialHub

A production-ready social media app built with the MERN stack.

## Features
- **User Accounts**: Register, login, profile management.
- **Posts**: Create, delete, like, and comment on posts.
- **Follow System**: Follow/unfollow users, personalized feed.
- **Real-time**: Real-time notifications using Socket.IO.
- **Search**: Search for users and posts.
- **Responsive UI**: Mobile-first design using Tailwind CSS.

## Tech Stack
- **Frontend**: React, Redux Toolkit, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO.
- **Auth**: JWT-based authentication.

## Setup Instructions

### Prerequisites
- Node.js (v18.x recommended)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/RohanThakre7/Community-Complex.git
cd SocialHub
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (use `.env.template` as a guide).

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Seed Data (Optional)
```bash
cd ../server
node seed.js
```

### 5. Run the Application
In separate terminals:
- **Server**: `cd server && npm run dev`
- **Client**: `cd client && npm run dev`

## API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/posts/feed` - Get personalized feed
- `POST /api/posts` - Create a post
- `POST /api/users/follow/:id` - Follow/unfollow a user

## Deployment
This app is ready for deployment to Heroku and MongoDB Atlas.
1. Set up a MongoDB Atlas cluster.
2. Create a Heroku app.
3. Add the environment variables to Heroku.
4. Push to Heroku: `git push heroku main`
