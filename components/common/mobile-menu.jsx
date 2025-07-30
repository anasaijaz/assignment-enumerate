"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  User,
  FileText,
  Palette,
  Layout,
  X,
  Moon,
  Sun,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/sidebar";

const menuItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    id: "design-system",
    label: "Design System",
    icon: Palette,
    href: "/design-system",
  },
  {
    id: "components",
    label: "Components",
    icon: Layout,
    hasSubmenu: true,
    submenu: [
      { id: "buttons", label: "Buttons", href: "/components/buttons" },
      { id: "cards", label: "Cards", href: "/components/cards" },
      { id: "forms", label: "Forms", href: "/components/forms" },
      { id: "navigation", label: "Navigation", href: "/components/navigation" },
    ],
  },
  {
    id: "documentation",
    label: "Documentation",
    icon: FileText,
    hasSubmenu: true,
    submenu: [
      {
        id: "getting-started",
        label: "Getting Started",
        href: "/docs/getting-started",
      },
      { id: "guidelines", label: "Guidelines", href: "/docs/guidelines" },
      {
        id: "best-practices",
        label: "Best Practices",
        href: "/docs/best-practices",
      },
    ],
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark =
      storedTheme === "dark" || (!storedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleSubmenu = (itemId) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  const handleLinkClick = () => {
    closeMobileMenu();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMobileMenu();
    }
  };

  const MenuItemComponent = ({ item, isSubmenuItem = false }) => {
    const Icon = item.icon;
    const hasSubmenu = item.hasSubmenu;
    const isSubmenuOpen = openSubmenu === item.id;

    if (hasSubmenu) {
      return (
        <Collapsible
          open={isSubmenuOpen}
          onOpenChange={() => toggleSubmenu(item.id)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-foreground hover:bg-accent motion-safe:transition-colors px-4 py-3 text-base font-medium"
            >
              {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
              <span className="flex-1 text-left">{item.label}</span>
              {isSubmenuOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.submenu?.map((subItem) => (
              <div key={subItem.id} className="ml-8">
                <MenuItemComponent item={subItem} isSubmenuItem />
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 text-foreground hover:bg-accent motion-safe:transition-colors",
          isSubmenuItem ? "px-4 py-2 text-sm" : "px-4 py-3 text-base",
          "font-medium"
        )}
        asChild
      >
        <a href={item.href} onClick={handleLinkClick}>
          {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
          <span className="flex-1 text-left">{item.label}</span>
        </a>
      </Button>
    );
  };

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
        onClick={handleBackdropClick}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-xl shadow-2xl transform motion-safe:transition-transform motion-safe:duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobileMenu}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto p-2 space-y-1"
          style={{ maxHeight: "calc(85vh - 80px)" }}
        >
          {menuItems.map((item, index) => (
            <div key={item.id}>
              <MenuItemComponent item={item} />
              {/* Add separator after certain items */}
              {(index === 1 || index === 3) && <Separator className="my-3" />}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Theme</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-primary"
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            Design System v1.0
          </div>
        </div>
      </div>
    </>
  );
}
