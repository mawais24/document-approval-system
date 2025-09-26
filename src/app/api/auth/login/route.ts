import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { AuthUtils } from "@/lib/auth";
export const runtime = "nodejs";

console.log("=== ENVIRONMENT DEBUG ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL value:",
  process.env.DATABASE_URL ? "SET" : "NOT SET"
);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("MONGO_URL exists:", !!process.env.MONGO_URL);
console.log(
  "All env vars with MONGO or DATABASE:",
  Object.keys(process.env).filter(
    (key) => key.includes("MONGO") || key.includes("DATABASE")
  )
);
console.log("========================");

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await AuthUtils.verifyPassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = AuthUtils.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        position: user.position,
      },
    });

    // Set HTTP-only cookie with JWT token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
