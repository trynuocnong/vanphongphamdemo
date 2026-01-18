import { useStore } from "@/lib/store";
import { Redirect } from "wouter";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "user" | "admin"; // nếu có truyền thì giới hạn theo role
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, authReady } = useStore();

  // Chờ load user xong
  if (!authReady) return null;

  // ❌ Nếu chưa đăng nhập → chuyển về login
  if (!user) return <Redirect to="/" />;

  // ❌ Nếu có role nhưng user không khớp → về trang chủ
  if (role && user.role !== role) return <Redirect to="/" />;

  // ✅ Nếu hợp lệ → render nội dung
  return <>{children}</>;
}
