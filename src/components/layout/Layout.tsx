// src/components/layout/Layout.tsx - Complete Main Layout Component
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "./Header";
import { Loader2, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  position?: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/api/auth/me", {
        timeout: 10000, // 10 second timeout
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        handleAuthFailure();
      }
    } catch (error: any) {
      console.error("Auth check failed:", error);

      if (error.code === "ECONNABORTED") {
        setError("Connection timeout. Please check your internet connection.");
      } else if (error.response?.status === 401) {
        handleAuthFailure();
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle authentication failure
  const handleAuthFailure = () => {
    setUser(null);
    // Only redirect to login if not already on login page
    if (pathname !== "/login") {
      router.push("/login");
    }
  };

  // Retry authentication
  const retryAuth = () => {
    checkAuth();
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
            <div className="absolute inset-0 h-12 w-12 border-2 border-blue-200 rounded-full mx-auto"></div>
          </div>
          <h3 className="mt-6 text-lg font-medium text-gray-900">
            Loading Dashboard
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we verify your authentication...
          </p>

          {/* Connection status indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-xs text-red-600">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error screen (with retry option)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-6">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connection Error
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>

          <div className="space-y-3">
            <button
              onClick={retryAuth}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Go to Login
            </button>
          </div>

          {/* Connection status */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Internet Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">No Internet Connection</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated users (login page or other public pages)
  if (!user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Authenticated users - full layout with header and sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} onUserUpdate={setUser} />

      {/* Offline indicator banner */}
      {!isOnline && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm">
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span>
              You're currently offline. Some features may not be available.
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb (optional, can be enhanced later) */}
        {pathname !== "/dashboard" && (
          <nav className="mb-6" aria-label="Breadcrumb">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <button
                onClick={() => router.push("/dashboard")}
                className="hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
              <span>/</span>
              <span className="text-gray-900 capitalize">
                {pathname.split("/").pop()?.replace("-", " ")}
              </span>
            </div>
          </nav>
        )}

        {/* Page Content */}
        <div className="animate-fadeIn">{children}</div>
      </main>

      {/* Footer (optional) */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <span>Document Approval System</span>
              <span className="ml-2">v1.0</span>
            </div>

            <div className="flex items-center space-x-4">
              <span>Role: {user.role}</span>
              {user.department && <span>• {user.department}</span>}
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <>
                    <Wifi className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 text-red-500" />
                    <span className="text-red-600">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
