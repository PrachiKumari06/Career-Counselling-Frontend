import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Onboarding from "./pages/onboarding/Onboarding";
import Assessment from "./pages/dashboard/Assessment";
import Job from "./pages/dashboard/Job";
import Forum from "./pages/forum/Forum";
import SinglePost from "./pages/forum/SinglePost";
import ResourceLibrary from "./pages/resource/ResourceLibrary";
import AddResource from "./pages/resource/AddResource";
import AIRecommendation from "./pages/ai/AIRecommendation"
import ForgotPassword from "./pages/auth/ForgotPassword";
import UpdatePassword from "./pages/auth/UpdatePassword"
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

export default function App() {
  
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>

  {/* Public Routes */}
  <Route
    path="/"
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    }
  />

  <Route
    path="/signup"
    element={
      <PublicRoute>
        <Signup />
      </PublicRoute>
    }
  />

  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/update-password" element={<UpdatePassword />} />

  {/* Protected Routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/onboarding"
    element={
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    }
  />

  <Route
    path="/assessment"
    element={
      <ProtectedRoute>
        <Assessment />
      </ProtectedRoute>
    }
  />

  <Route
    path="/jobs"
    element={
      <ProtectedRoute>
        <Job />
      </ProtectedRoute>
    }
  />

  <Route
    path="/forum"
    element={
      <ProtectedRoute>
        <Forum />
      </ProtectedRoute>
    }
  />

  <Route
    path="/forum/:id"
    element={
      <ProtectedRoute>
        <SinglePost />
      </ProtectedRoute>
    }
  />

  <Route
    path="/resources"
    element={
      <ProtectedRoute>
        <ResourceLibrary />
      </ProtectedRoute>
    }
  />

  <Route
    path="/resources/add"
    element={
      <ProtectedRoute>
        {localStorage.getItem("role") === "counselor"
          ? <AddResource />
          : <Navigate to="/dashboard" />}
      </ProtectedRoute>
    }
  />

  <Route
    path="/ai-recommendation"
    element={
      <ProtectedRoute>
        <AIRecommendation />
      </ProtectedRoute>
    }
  />

</Routes>
      </BrowserRouter>
    </>
  );
}
