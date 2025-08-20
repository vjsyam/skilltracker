import React from "react";
import { authService } from "../services/authService";

export default function RoleBasedAccess({ 
  children, 
  allowedRoles = [], 
  fallback = null,
  requireAdmin = false 
}) {
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    return fallback || <div>Please log in to access this content.</div>;
  }

  // Check if user has required role
  const hasRequiredRole = allowedRoles.length === 0 || 
    allowedRoles.includes(currentUser.role);

  // Check if admin is required
  const isAdminRequired = requireAdmin && currentUser.role !== "ADMIN";

  if (!hasRequiredRole || isAdminRequired) {
    return fallback || null;
  }

  return children;
}

// Helper components for common use cases
export function AdminOnly({ children, fallback = null }) {
  return (
    <RoleBasedAccess allowedRoles={["ADMIN"]} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
}

export function EmployeeOnly({ children, fallback = null }) {
  return (
    <RoleBasedAccess allowedRoles={["EMPLOYEE"]} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
}

export function ViewOnly({ children, fallback = null }) {
  return (
    <RoleBasedAccess allowedRoles={["ADMIN", "EMPLOYEE"]} fallback={fallback}>
      {children}
    </RoleBasedAccess>
  );
}
