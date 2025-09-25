// src/lib/auth.ts - Fixed Authentication Utilities
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in your environment variables");
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  position?: string;
}

// Check if we're running in Edge Runtime
const isEdgeRuntime = () => {
  return (
    typeof globalThis !== "undefined" &&
    // @ts-ignore - EdgeRuntime is not in types
    typeof globalThis.EdgeRuntime !== "undefined"
  );
};

export class AuthUtils {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  /**
   * Verify a password against its hash
   */
  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate a JWT token
   */
  static generateToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "24h",
      issuer: "document-approval-system",
    });
  }

  /**
   * Verify and decode a JWT token (Node.js runtime only)
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      // Skip JWT verification in Edge Runtime
      if (isEdgeRuntime()) {
        console.warn("JWT verification not available in Edge Runtime");
        return null;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  /**
   * Simple token format validation (Edge Runtime compatible)
   * This doesn't verify the signature, just checks if it looks like a JWT
   */
  static isValidTokenFormat(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Try to decode the payload (without verification)
      const payload = JSON.parse(atob(parts[1]));

      // Check if it has required fields
      return !!(
        payload.userId &&
        payload.email &&
        payload.role &&
        payload.name
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract JWT token from request headers or cookies
   */
  static extractTokenFromRequest(request: NextRequest): string | null {
    // Check Authorization header first
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    // Check cookies as fallback
    const token = request.cookies.get("auth-token")?.value;
    return token || null;
  }

  /**
   * Get user info from request (for API routes only)
   */
  static getUserFromRequest(request: NextRequest): AuthUser | null {
    const token = this.extractTokenFromRequest(request);
    if (!token) return null;

    const payload = this.verifyToken(token);
    if (!payload) return null;

    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  }
}
