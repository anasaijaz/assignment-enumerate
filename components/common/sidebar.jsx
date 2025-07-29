"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Settings,
  User,
  FileText,
  Palette,
  Layout,
  Menu,
  X,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
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

export default function Sidebar({ className }) {
  const { isCollapsed, toggleSidebar } = useUIStore();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (itemId) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  const MenuItemComponent = ({ item, isSubmenuItem = false }) => {
    const Icon = item.icon;
    const hasSubmenu = item.hasSubmenu && !isCollapsed;
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
              className={cn(
                "w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground hover:bg-accent",
                isCollapsed ? "px-2.5" : "px-3.5",
                "text-sm font-medium"
              )}
            >
              {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isSubmenuOpen ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-0.5">
            {item.submenu?.map((subItem) => (
              <div key={subItem.id} className="ml-7">
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
          "w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground hover:bg-accent",
          isCollapsed ? "px-2.5" : "px-3.5",
          isSubmenuItem ? "text-xs" : "text-sm",
          "font-medium"
        )}
        asChild
      >
        <a href={item.href}>
          {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
          {!isCollapsed && (
            <span className="flex-1 text-left">{item.label}</span>
          )}
        </a>
      </Button>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-border">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-foreground">Menu</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-1.5"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2.5 space-y-0.5">
        {menuItems.map((item, index) => (
          <div key={item.id}>
            <MenuItemComponent item={item} />
            {/* Add separator after certain items */}
            {(index === 1 || index === 3) && <Separator className="my-2.5" />}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3.5 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            Design System v1.0
          </div>
        </div>
      )}
    </div>
  );
}
