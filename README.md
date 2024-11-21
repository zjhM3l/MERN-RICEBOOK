# Ricebook - A Full-Stack Social Media Application

Ricebook is a comprehensive social media platform built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The application allows users to interact, share posts, follow each other, and communicate in real-time. This README provides a detailed overview of the features, technologies, setup, and development insights encountered throughout the development process.

---

## Table of Contents
- [Features](#features)
  - [User Authentication](#user-authentication)
  - [Profile Management](#profile-management)
  - [Social Interactions](#social-interactions)
  - [Posts and Feed](#posts-and-feed)
  - [Messaging and Notifications](#messaging-and-notifications)
  - [Search and Filtering](#search-and-filtering)
  - [Real-time Updates](#real-time-updates)
- [Tech Stack](#tech-stack)
- [Backend Architecture](#backend-architecture)
  - [Database Schema](#database-schema)
  - [API Endpoints](#api-endpoints)
  - [Authentication and Authorization](#authentication-and-authorization)
- [Frontend Architecture](#frontend-architecture)
  - [Component Structure](#component-structure)
  - [State Management](#state-management)
  - [Styling](#styling)
- [Issues and Solutions](#issues-and-solutions)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Future Enhancements](#future-enhancements)
- [Acknowledgments](#acknowledgments)

---

## Features

### User Authentication
- **Sign-Up and Login**: Users can register and log in using their email and password. Input validation ensures email format and password strength.
- **OAuth Integration**: Google and Facebook authentication are available for streamlined login, using `passport.js` with OAuth2.0.
- **Session Persistence**: JWT-based authentication provides secure and scalable session handling with tokens stored securely.

### Profile Management
- **User Profiles**: Each user has a customizable profile with a display picture, username, bio, and status headline (defaulted to the company’s catchphrase).
- **Status Updates**: Users can update their status headline, displayed across their posts and profile.
- **Avatar Upload**: Users can upload and change their profile pictures, which are stored on a cloud service like Firebase.

### Social Interactions
- **Following System**: Users can follow/unfollow others. Follower and following lists update in real-time.
- **Like and Comment on Posts**: Users can interact with posts through likes and comments, with feedback indicators for each interaction.
- **Friend Recommendations**: Based on mutual connections and shared interests, recommended users to follow are displayed.

### Posts and Feed
- **Post Creation**: Users can create posts with text, images, or a combination. The rich-text editor supports basic styling.
- **User Feed**: A personalized feed of the latest posts from followed users, sorted by timestamp.
- **Infinite Scroll**: Dynamic feed loading using infinite scroll for seamless user experience.
- **Editing and Deleting Posts**: Users can modify or delete their posts with permissions and restrictions handled on the server.

### Messaging and Notifications
- **Real-time Chat**: Users can engage in private, real-time chats with others. Chat history is stored for continuity.
- **Notifications**: Real-time notifications for new messages, likes, follows, and comments, with badges indicating unread notifications.
- **Unread Message Count**: Badge displays the number of unread messages directly in the navigation bar for quick reference.

### Search and Filtering
- **Global Search**: Users can search for posts, users, and hashtags. Search is optimized for performance with debouncing and throttling.
- **Post Filtering**: Feed can be filtered by date, popularity, or specific hashtags, with a toggle for different views (grid or list).

### Real-time Updates
- **WebSocket Integration**: Real-time updates for notifications, chat messages, and post interactions using WebSockets (Socket.io).
- **Optimistic UI Updates**: Certain actions, like following/unfollowing and liking posts, show immediate feedback while syncing with the backend.

---

## Tech Stack

| Technology    | Purpose                                      |
|---------------|----------------------------------------------|
| **MongoDB**   | NoSQL Database to store user data, posts, messages, and notifications. |
| **Express.js**| Backend framework for API handling, request routing, and middleware integration. |
| **React.js**  | Frontend framework for UI rendering, state management, and routing. |
| **Node.js**   | Server environment for backend logic and WebSocket connections. |
| **Firebase**  | Image storage and authentication for user avatars and media files. |
| **Socket.io** | Real-time communication for messaging and notifications. |
| **Redux**     | State management for consistent data handling across components. |
| **Material-UI** | Styling and layout framework for a responsive and modern UI. |

---

## Backend Architecture

### Database Schema
- **User Collection**: Stores user profile information, followers, following, and authentication credentials.
- **Post Collection**: Each document represents a post, including author, timestamp, content, likes, and comments.
- **Message Collection**: Chat messages with references to sender and receiver, timestamps, and read/unread status.
- **Notification Collection**: Stores notifications with types (like, comment, follow) and reference to relevant users/posts.

### API Endpoints
- **Auth Routes**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- **User Routes**: `/api/user/:id` for profile, `/api/user/follow`, `/api/user/unfollow`
- **Post Routes**: `/api/posts`, `/api/posts/:id`, `/api/posts/like`, `/api/posts/comment`
- **Message Routes**: `/api/messages/:conversationId`, `/api/messages/send`
- **Notification Routes**: `/api/notifications`, `/api/notifications/read`

### Authentication and Authorization
- **JWT Tokens**: Secure, stateless authentication using JWTs stored in HTTP-only cookies.
- **Passport.js**: OAuth2.0 with Google and Facebook integration.
- **Authorization Middleware**: Middleware checks for token validity and user roles before granting access to routes.

---

## Frontend Architecture

### Component Structure
- **Navbar**: Displays navigation links, user avatar, notifications, and search bar.
- **Sidebar**: Contains quick links to friends, groups, settings, and notifications.
- **Feed**: Displays posts in a feed layout with options for sorting and filtering.
- **Post**: Individual post component showing author, timestamp, content, likes, and comments.
- **Profile**: Displays user details, posts, and follow/unfollow options.
- **Chat**: Private chat interface with real-time messaging, message history, and online indicators.

### State Management
- **Redux**: Global state management for user authentication, notifications, posts, and chat messages.
- **Redux Thunk**: Middleware for handling async actions like API calls for post fetching and message sending.
- **Local State**: Component-level state for UI interactions like form inputs, modals, and loading indicators.

### Styling
- **Material-UI**: Used for component styling, responsive design, and layout adjustments.
- **Custom Themes**: Dark mode support and custom color themes consistent with the Ricebook brand.

---

## Issues and Solutions

### Issue: Session Persistence across Reloads
- **Solution**: Used JWTs in HTTP-only cookies for session persistence. Implemented Redux for state rehydration.

### Issue: Avatar Uploading Errors
- **Solution**: Configured Firebase to handle CORS issues and ensured image size limits.

### Issue: Slow Loading for Large Feeds
- **Solution**: Implemented lazy loading with pagination and optimized MongoDB queries.

### Issue: Chat Real-Time Synchronization
- **Solution**: Integrated Socket.io for WebSocket-based real-time messaging and notifications.

### Issue: Search Performance
- **Solution**: Debounced search inputs and indexed MongoDB fields to improve search query speed.

---

## Getting Started

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/ricebook.git
   cd ricebook

2. **Install dependencies**：
   ```bash
   npm install
   
4. **Set up environment variables**：
   Create a .env file in the root directory with the following:
   ```plaintext
   MONGO_URI=your_mongo_db_uri
   JWT_SECRET=your_jwt_secret
   FIREBASE_CONFIG=your_firebase_config
   
### Running the Application
1. **Backend**:
   ```bash
   npm start

2. **Frontend**:
   ```bash
   cd my-app
   npm start

3. **Access the app**:
   Open http://localhost:3000 in your browser to see Ricebook in action.

## Future Enhancements

- **Profile Privacy**: Implement privacy settings for profile visibility and content sharing.
- **Image Compression**: Enhance performance by compressing uploaded images.
- **Group Chat**: Expand messaging to support group chats.
- **Stories Feature**: Add temporary posts (stories) that disappear after 24 hours.


## Acknowledgments
This project was developed as part of the Rice University Web Development Course COMP531. Special thanks to Professor Joyner for guidance and feedback.


