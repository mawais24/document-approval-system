// src/app/dashboard/page.tsx - Complete Dashboard Page
"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  Upload,
  Eye,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
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

interface DashboardStats {
  totalDocuments: number;
  pendingDocuments: number;
  approvedDocuments: number;
  inReviewDocuments: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    pendingDocuments: 0,
    approvedDocuments: 0,
    inReviewDocuments: 0,
  });

  const router = useRouter();

  useEffect(() => {
    checkAuth();
    // In the future, we'll also load dashboard stats here
    // loadDashboardStats();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const getDashboardTitle = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin Dashboard";
      case "ceo":
        return "CEO Dashboard";
      case "approver":
        return "Approver Dashboard";
      case "uploader":
        return "Document Upload Dashboard";
      default:
        return "Dashboard";
    }
  };

  const getDashboardDescription = (role: string, name: string) => {
    switch (role) {
      case "admin":
        return `Welcome back, ${name}! Manage users, workflows, and system settings.`;
      case "ceo":
        return `Welcome back, ${name}! Review final approvals and system overview.`;
      case "approver":
        return `Welcome back, ${name}! Review and approve pending documents in your queue.`;
      case "uploader":
        return `Welcome back, ${name}! Upload documents and track their approval status.`;
      default:
        return `Welcome back, ${name}! Here's your document approval overview.`;
    }
  };

  const getRoleSpecificActions = (role: string) => {
    switch (role) {
      case "uploader":
        return [
          {
            title: "Upload New Document",
            description: "Upload a PDF document for approval",
            icon: Upload,
            color: "blue",
            action: () => router.push("/upload"),
          },
          {
            title: "My Documents",
            description: "View documents you have uploaded",
            icon: FileText,
            color: "green",
            action: () => router.push("/my-documents"),
          },
        ];
      case "approver":
      case "ceo":
        return [
          {
            title: "Review Documents",
            description: "Review pending documents awaiting your approval",
            icon: Clock,
            color: "yellow",
            action: () => router.push("/approval"),
          },
          {
            title: "Approved Documents",
            description: "View documents you have approved",
            icon: CheckCircle,
            color: "green",
            action: () => router.push("/approved-documents"),
          },
        ];
      case "admin":
        return [
          {
            title: "Manage Users",
            description: "Add, edit, or remove system users",
            icon: Users,
            color: "purple",
            action: () => router.push("/admin/users"),
          },
          {
            title: "Workflow Management",
            description: "Create and manage approval workflows",
            icon: TrendingUp,
            color: "indigo",
            action: () => router.push("/admin/workflows"),
          },
        ];
      default:
        return [];
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: {
      [key: string]: { bg: string; text: string; hover: string };
    } = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        hover: "hover:border-blue-300 hover:bg-blue-50",
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        hover: "hover:border-green-300 hover:bg-green-50",
      },
      yellow: {
        bg: "bg-yellow-100",
        text: "text-yellow-600",
        hover: "hover:border-yellow-300 hover:bg-yellow-50",
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        hover: "hover:border-purple-300 hover:bg-purple-50",
      },
      indigo: {
        bg: "bg-indigo-100",
        text: "text-indigo-600",
        hover: "hover:border-indigo-300 hover:bg-indigo-50",
      },
    };
    return colorMap[color] || colorMap.blue;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in to access the dashboard.
          </p>
        </div>
      </Layout>
    );
  }

  const roleActions = getRoleSpecificActions(user.role);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {getDashboardTitle(user.role)}
          </h1>
          <p className="text-gray-600 mt-2">
            {getDashboardDescription(user.role, user.name)}
          </p>
          {user.department && (
            <p className="text-sm text-gray-500 mt-1">
              {user.position} • {user.department}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Documents
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDocuments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Pending Review
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingDocuments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Approved
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approvedDocuments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  In Review
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inReviewDocuments}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Role Specific */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleActions.map((action, index) => {
              const colors = getColorClasses(action.color);
              const Icon = action.icon;

              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`p-6 border-2 border-dashed border-gray-300 rounded-lg ${colors.hover} transition-all duration-200 group`}
                >
                  <div
                    className={`p-3 ${colors.bg} rounded-lg w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-8 w-8 ${colors.text}`} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              );
            })}

            {/* Universal Action - View All Documents */}
            <button
              onClick={() => router.push("/documents")}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className="p-3 bg-gray-100 rounded-lg w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Eye className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                View All Documents
              </h3>
              <p className="text-sm text-gray-600">
                Browse and search all documents in the system
              </p>
            </button>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Activity
          </h2>
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Recent Activity
            </h3>
            <p className="text-gray-500 mb-4">
              Documents and approvals will appear here as they are processed.
            </p>
            <div className="text-sm text-gray-400">
              <p>Activity types include:</p>
              <p>• Document uploads • Approvals • Status changes • Comments</p>
            </div>
          </div>
        </div>

        {/* System Status (Admin Only) */}
        {user.role === "admin" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              System Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-green-800">
                    Database
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Connected and operational
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-green-800">
                    File Storage
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Available and ready
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-yellow-800">
                    OneDrive Sync
                  </span>
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  Not configured yet
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
