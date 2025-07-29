"use client";

import { useEffect } from "react";
import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/header";
import MobileMenu from "@/components/common/mobile-menu";
import { useUIStore } from "@/store/sidebar";

export default function ProtectedLayout({ children }) {
  const { isCollapsed, isMobileMenuOpen, closeMobileMenu } = useUIStore();

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-shrink-0 overflow-y-auto border-r border-border motion-safe:transition-all motion-safe:duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Header */}
        <Header
          title="Dashboard"
          subtitle="Welcome to your design system workspace"
        />

        {/* Page Content */}
        <div className="p-4 md:p-7">{children}</div>
      </main>

      {/* Mobile Menu */}
      <MobileMenu />
    </div>
  );
}
