# 🚀 ByteBlogs – AI-Powered Blogging Platform

## 📌 Overview

ByteBlogs is a full-stack blogging platform built using **Next.js and Supabase**, enhanced with AI-powered content summarization. The application allows users to create, manage, and interact with blog posts through a role-based system.

The goal of this project is to demonstrate full-stack development skills, AI integration, and system design understanding using modern tools and best practices.

---

* GitHub Repository: https://github.com/Amit-Amitt/ByteBlogs
* Live URL: https://byte-blogs-two.vercel.app/
  
---

## 🛠️ Tech Stack

| Layer              | Technology                       |
| ------------------ | -------------------------------- |
| Frontend + Backend | Next.js (App Router, TypeScript) |
| Authentication     | Supabase Auth                    |
| Database           | Supabase (PostgreSQL)            |
| Storage            | Supabase Storage                 |
| Styling            | Tailwind CSS                     |
| AI Integration     | Google AI API (Gemini)           |
| Version Control    | Git + GitHub                     |
| Deployment         | Vercel                           |

---

## 👥 User Roles & Permissions

The platform supports three roles:

### 🔹 Viewer

* View blog posts
* Read AI-generated summaries
* Add comments

### 🔹 Author

* Create posts
* Edit their own posts
* View comments on their posts

### 🔹 Admin

* View all posts
* Edit any post
* Monitor comments

Role-based access is enforced both:

* On the frontend (UI visibility)
* On the backend (secure data operations)

---

## 📝 Features

### 📚 Blog System

* Create, edit, and delete posts
* Post fields:

  * Title
  * Featured Image
  * Body Content
  * AI-generated Summary
* Pagination for post listing
* Search functionality

### 💬 Comments System

* Users can comment on posts
* Comments linked to users and posts
* Real-time display of comments

### 🤖 AI Integration

* Automatically generates ~200-word summary when a post is created
* Summary stored in database (not regenerated repeatedly)
* Displayed in post listing

### 👤 Profile Page

* View user details
* See all posts created by the user

### 🎨 UI Enhancements

* Responsive design
* Clean and modern layout
* Loading states and better UX

---

## 🗄️ Database Design

### Tables:

#### Users

* id
* name
* email
* role

#### Posts

* id
* title
* body
* image_url
* author_id
* summary

#### Comments

* id
* post_id
* user_id
* comment_text

Relationships:

* One user → many posts
* One post → many comments

---

## 🔄 Feature Logic

### 🔐 Authentication Flow

1. User signs up via Supabase Auth
2. User data stored in database with default role (viewer)
3. Session maintained using Supabase

---

### 🛡️ Role-Based Access

* Middleware protects routes
* Backend ensures:

  * Authors edit only their posts
  * Admins have full control

---

### ✍️ Post Creation Flow

1. Author creates a post
2. Data stored in database
3. AI summary generated
4. Summary saved in `summary` field

---

### 🤖 AI Summary Flow

1. Post content sent to Google AI API
2. AI generates ~200-word summary
3. Summary stored in database
4. Displayed on UI

---

## 💰 Cost Optimization

* AI summary generated **only once per post**
* Stored in database to avoid repeated API calls
* Reduces token usage and API cost

---

## 🧠 Development Understanding

### 🔧 Bug Faced:

While implementing post creation, AI summary was being generated multiple times due to re-renders.

### ✅ Solution:

* Moved summary generation to backend logic
* Ensured it runs only once during post creation

---

### 🏗️ Key Architectural Decisions:

* Used Supabase to simplify backend development
* Stored user roles in database for flexible access control
* Separated UI and business logic for maintainability
* Used modular folder structure for scalability

---

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/byteblogs.git
cd byteblogs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GOOGLE_AI_API_KEY=your_api_key
```

### 4. Run Locally

```bash
npm run dev
```

---

## 🌐 Deployment

The application is deployed on **Vercel** and is publicly accessible.

---

## 🎯 Conclusion

This project demonstrates:

* Full-stack development using modern tools
* AI integration in real-world applications
* Role-based system design
* Clean architecture and optimization strategies

The focus was not just on building features, but on **understanding and implementing them effectively**.

---
