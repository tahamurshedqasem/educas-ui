// src/components/auth/AuthWrapper.js
"use client";

import { useAuth } from "@/context/AuthContext";

export default function AuthWrapper({ children }) {
  const { user } = useAuth();

  // Clone the child with user prop
  return children;
}
