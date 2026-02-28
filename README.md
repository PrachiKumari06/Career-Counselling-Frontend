# CareerConnect - Frontend

##  Project Overview

CareerConnect is a Full Stack Career Counseling Platform where users can:

- Register and Login securely
- Create and update career profiles
- Take career assessments
- Explore job opportunities
- Receive job matching notifications
- Book counselor sessions
- Access resources and forum discussions
- Get AI-based career recommendations

This repository contains the Frontend built using React and Tailwind CSS.

---------------------------------------------------------------------------------------------

##  Tech Stack Used

-  React (Vite)
-  Tailwind CSS
-  Axios (API communication)
-  JWT Authentication
-  React Router DOM
-  React Hot Toast
-  Lucide Icons

---------------------------------------------------------------------------------------------

## Project Structure

```
src/
├── assets/
├── axios/
├── component/
├── context/
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── forum/
│   ├── onboarding/
│   ├── resource/
│   └── ai/
├── routes/
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
├── App.jsx
└── main.jsx
```
---------------------------------------------------------------------------------------------

##  Features:-

###  Authentication
- Login / Signup
- JWT Token Storage
- Route Protection (ProtectedRoute & PublicRoute)
- Role-based access (Counselor vs User)

###  Career Profile
- Create profile
- Update profile
- Skill-based matching

###  Career Assessment
- Timed assessment
- Score calculation
- Personalized profile result

###  Jobs
- View jobs
- Apply to jobs
- Resume upload
- Job highlighting
- Skill-based notification modal

###  Forum
- View posts
- View single post
- Community interaction

###  Resources
- Resource library
- Add resource (Counselor only)

###  AI Recommendation
- AI-based career suggestions

### Notifications
- Job match detection
- Modal notification
- Unread count badge

---------------------------------------------------------------------------------------------

## Route Protection

Protected Routes:
- Dashboard
- Assessment
- Jobs
- Forum
- Resources
- AI Recommendation
- Onboarding

Public Routes:
- Login
- Signup

---------------------------------------------------------------------------------------------

##  Deployment

Frontend (Netlify):
 https://careerconnect-counselling.netlify.app

Backend (Render):
 https://careercounselling-backend.onrender.com

------------------------------------------------------------------------------------------
##  Screenshots

###  Login Page
![Login](screenshot_ui/login.png)

### Signup Page
![Signup](screenshot_ui/signup.png)

###  Dashboard
![Dashboard](screenshot_ui/dashboard.png)

###  Notification Modal
![Notification](screenshot_ui/notification_modal.png)

###  Career Assessment
![Assessment](screenshot_ui/career-assessment.png)

###  Assessment Result
![Assessment Result](screenshot_ui/career-assessment-result.png)

###  Job Page
![Jobs](screenshot_ui/job.png)

###  Community Forum
![Forum](screenshot_ui/community-forum.png)

###  Single Forum Post
![Single Post](screenshot_ui/forum-singlePost.png)

###  Resource Library
![Resources](screenshot_ui/resource-library.png)

### AI Recommendation
![AI Recommendation](screenshot_ui/ai-recommendation.png)

### AI Recommendation Pathmap
![AI Pathmap](screenshot_ui/ai-recommendation-pathmap.png)

--------------------------------------------------------------------------------------------------
## Video Walkthrough Link
Link : https://drive.google.com/file/d/14JgBlLZ-2CqjMI76et8ITGmlXVdjzYtG/view?usp=sharing

--------------------------------------------------------------------------------------------------
##  Installation & Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install