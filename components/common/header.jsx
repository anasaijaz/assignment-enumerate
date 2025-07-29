"use client";

import { Search, Bell, Settings, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/store/sidebar";

export default function Header({ title = "Dashboard", subtitle }) {
  const { toggleMobileMenu } = useUIStore();

  return (
    <header className="flex items-center justify-between p-4 md:p-7 border-b border-border bg-card">
      {/* Left Section - Page Title */}
      <div className="flex-1">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground hidden md:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center Section - Search Field (Hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-7">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="pl-10 bg-background border-input focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Right Section - Actions & User Avatar */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="p-2.5 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="sm" className="relative p-2.5">
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>
        </div>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className="p-2.5 hidden md:inline-flex"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/api/placeholder/32/32" alt="User Avatar" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <div className="text-sm font-medium text-foreground">John Doe</div>
            <div className="text-xs text-muted-foreground">
              john@example.com
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
