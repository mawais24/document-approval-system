// src/components/layout/Header.tsx - Updated Header Component
"use client";

import { useState } from "react";
import { FileText, LogOut, User, ChevronDown, Settings } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  position?: string;
}

interface HeaderProps {
  user: User | null;
  onUserUpdate?: (user: User | null) => void;
}

export default function Header({ user, onUserUpdate }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post("/api/auth/logout");

      // Update parent component
      if (onUserUpdate) {
        onUserUpdate(null);
      }

      // Clear any client-side state if needed
      localStorage.removeItem("user"); // If you store user data locally

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout anyway
      if (onUserUpdate) {
        onUserUpdate(null);
      }
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ceo":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approver":
        return "bg-green-100 text-green-800 border-green-200";
      case "uploader":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "ceo":
        return "CEO";
      case "approver":
        return "Approver";
      case "uploader":
        return "Uploader";
      case "admin":
        return "Admin";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  // Close dropdown when clicking outside
  const handleBackdropClick = () => {
    setDropdownOpen(false);
  };

  return (
    <>
      {/* Backdrop for dropdown */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={handleBackdropClick} />
      )}

      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
              >
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
                  Document Approval System
                </h1>
                <h1 className="text-lg font-semibold text-gray-900 sm:hidden">
                  DAS
                </h1>
              </button>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </button>

              {user.role === "uploader" && (
                <button
                  onClick={() => router.push("/upload")}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Upload
                </button>
              )}

              {(user.role === "approver" || user.role === "ceo") && (
                <button
                  onClick={() => router.push("/approval")}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Approvals
                </button>
              )}

              {user.role === "admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Admin
                </button>
              )}

              <button
                onClick={() => router.push("/documents")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Documents
              </button>
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-gray-600" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-medium text-gray-700 truncate max-w-32">
                      {user.name}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        {user.position && (
                          <p className="text-xs text-gray-500 truncate">
                            {user.position}
                            {user.department && ` • ${user.department}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/profile");
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-500" />
                      Profile Settings
                    </button>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      {isLoggingOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
