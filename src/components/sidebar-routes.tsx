"use client";
import React from "react";
import {
  ClipboardIcon,
  CircleIcon,
  PlusCircledIcon,
  FileIcon,
  PersonIcon,
  StackIcon,
} from "@radix-ui/react-icons";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link, useLocation} from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

export const SidebarRoutes = () => {
  const {  status } = useAuth();
  const isAdmin = status === "Admin";
  const userRole = status;
  // const navigate = useNavigate();
  const { pathname } = useLocation();
  type RouteType = {
    title: string;
    href?: string;
    icon: React.JSX.Element;
    label: string;
    isTitle: boolean;
    children?: {
      title: string;
      label: string;
      href: string;
      parentKey: string;
      icon: React.JSX.Element;
    }[];
  };

  const adminRoutes: RouteType[] = [
    {
      title: "Division",
      label: "Division",
      isTitle: false,
      icon: <FileIcon />,
      children: [
        {
          title: "New Division",
          label: "New Division",
          href: "/dash/departments/new",
          parentKey: "Department",
          icon: <PlusCircledIcon />,
        },
        {
          title: "Division List",
          label: "Division List",
          href: "/dash/departments",
          parentKey: "Department",
          icon: <CircleIcon />,
        },
      ],
    },
    {
      title: "Project Phases",
      label: "Project Phases",
      isTitle: false,
      icon: <StackIcon />,
      children: [
        {
          title: "New Phase",
          label: "New Phases",
          href: "/dash/phases/new",
          parentKey: "Project Phases",
          icon: <PlusCircledIcon />,
        },
        {
          title: "View Phases",
          label: "View Phases",
          href: "/dash/phases",
          parentKey: "Project Phases",
          icon: <CircleIcon />,
        },
      ],
    },

    {
      title: "Employee",
      label: "Employee",
      isTitle: false,
      icon: <PersonIcon />,
      children: [
        {
          title: "NewEmployee",
          label: "New Employee",
          href: "/dash/users/new",
          parentKey: "Employee",
          icon: <PersonIcon />,
        },
        {
          title: "Employee List",
          label: "Employee List",
          href: "/dash/users",
          parentKey: "Employee",
          icon: <CircleIcon />,
        },
      ],
    },
  ];

  const commonRoutes: RouteType[] = [
    {
      title: "Dashboard",
      label: "Dashboard",
      href: "/dash",
      isTitle: false,
      icon: <ClipboardIcon />,
    },

    ...(userRole !== "Admin"
      ? [
          {
            title: "Leave Approval",
            label: "Leave Approval",
            href: "/dashboard/leave-approval",
            isTitle: false,
            icon: <ClipboardIcon />,
          },
        ]
      : []),
  ];

  const routes = isAdmin ? [...commonRoutes, ...adminRoutes] : commonRoutes;

  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="flex flex-col gap-2">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          if (route.children && route.children.length > 0) {
            return (
              <Accordion
                className="w-full"
                type="single"
                collapsible
                key={route.title}
              >
                <AccordionItem value={route.title}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-1">
                      {route.icon}
                      {route.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {route.children.map((child) => {
                      const isSubActive = pathname === child.href;
                      return (
                        <Link key={child.title} to={child.href}>
                          <NavigationMenuItem className="w-full">
                            <NavigationMenuLink
                              className={cn(
                                navigationMenuTriggerStyle(),
                                "flex justify-start gap-2 w-full cursor-pointer text-opacity-50",
                                isSubActive && "text-opacity-100 bg-clicked"
                              )}
                            >
                              {child.icon}
                              {child.title}
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        </Link>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          } else {
            return (
              <Link key={route.title} to={route.href!} className="w-full">
                <NavigationMenuItem className="w-full">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex justify-start gap-2 w-full cursor-pointer text-opacity-50",
                      isActive && "text-opacity-100 bg-clicked"
                    )}
                  >
                    {route.icon}
                    {route.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </Link>
            );
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
