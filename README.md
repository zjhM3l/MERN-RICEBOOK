# Ricebook - A Full-Stack Social Media Application

Ricebook is a full-stack social media platform built using the **MERN (MongoDB, Express.js, React.js, Node.js)** stack. It allows users to interact, share posts, follow/unfollow users, and communicate in real-time. The application follows a **modular and test-driven development approach**, ensuring a scalable and maintainable system.

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
- **Sign-Up and Login**: Users can register and log in using email and password.
- **OAuth Integration**: Google and Facebook authentication using `passport.js`.
- **Session Management**: JWT-based authentication for session persistence.

### Profile Management
- **Customizable Profiles**: Users can update avatars, bios, and headlines.
- **Avatar Upload**: Images stored using **Firebase Storage**.

### Social Interactions
- **Follow/Unfollow System**: Dynamic updates to followers and following lists.
- **Likes and Comments**: Engage with posts interactively.

### Posts and Feed
- **Create, Edit, Delete Posts**: Rich text support for posts.
- **Feed Pagination**: Optimized loading using infinite scroll.

### Messaging and Notifications
- **Real-time Chat**: WebSocket-based messaging.
- **Unread Notifications**: Alerts for new messages, likes, follows, and comments.

### Search and Filtering
- **Global Search**: Find users, posts, and hashtags.
- **Post Filtering**: Sort feed by relevance, date, and popularity.

### Real-time Updates
- **Socket.io Integration**: Live updates for messages and notifications.
- **Optimistic UI**: Fast feedback for actions like following and liking posts.
  
---

## Tech Stack

| Technology    | Purpose |
|--------------|---------|
| **MongoDB** | NoSQL database for user data, posts, messages |
| **Express.js** | Backend API framework |
| **React.js** | Frontend UI framework |
| **Node.js** | Backend runtime environment |
| **Firebase** | Image storage for avatars and posts |
| **Socket.io** | Real-time messaging |
| **Redux** | State management |
| **Material-UI** | UI components and styling |
| **Jest** | Frontend testing framework |
| **Jasmine** | Backend unit testing |
| **Postman** | API testing |
| **Surge** | Frontend deployment |
| **Heroku** | Backend deployment |

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

- **API testing was done using Postman.** Each endpoint was validated before frontend integration.


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
   cd api
   npm install
   cd ..
   cd my-app
   npm install
   
### Running the Application
1. **Backend**:
   ```bash
   cd api
   npm start

2. **Frontend**:
   ```bash
   cd my-app
   npm start
   y

3. **Access the app**:
   Open http://localhost:3000 in your browser to see Ricebook in action.

## Deployment

### Test User Credentials
- **Username**: `qhdplan@163.com`
- **Password**: `Ljh20011026!`

### Application Links
- **Frontend**: [Rice Book Frontend](http://rice-book-frontend.surge.sh)
- **Backend**: [Rice Book Backend](https://rice-book-c9430e7a29a6.herokuapp.com/)

### Instructions to Test
1. Visit the [Frontend Deployment](http://rice-book-frontend.surge.sh).
2. Log in using the provided test user credentials:
   - Username: `qhdplan@163.com`
   - Password: `Ljh20011026!`
3. Interact with the application:
   - View posts from other users.
   - Create your own posts.
   - Like or follow posts.
   - Test pagination and search functionalities.
4. If there are any issues, the backend is hosted at [Rice Book Backend](https://rice-book-c9430e7a29a6.herokuapp.com/).

## Future Enhancements

- **Profile Privacy**: Implement privacy settings for profile visibility and content sharing.
- **Image Compression**: Enhance performance by compressing uploaded images.
- **Group Chat**: Expand messaging to support group chats.
- **Stories Feature**: Add temporary posts (stories) that disappear after 24 hours.


## Acknowledgments
This project was developed as part of the Rice University Web Development Course COMP531. Special thanks to Professor Joyner for guidance and feedback.


