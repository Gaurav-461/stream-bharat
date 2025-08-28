"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, VideoIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { StudioSidebarHeader } from "./studio-sidebar-header";


export const StudioSidebar = () => {
  const pathName = usePathname();
  return (
    <Sidebar className="z-40 pt-16" collapsible="icon">
      <SidebarContent>

        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader />
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathName === "/studio"}
                asChild
                tooltip="Content"
              >
                <Link href="/studio">
                  <VideoIcon className="size-4" />
                  <span>Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Exit Studio">
                <Link href="/">
                  <LogOutIcon className="size-4" />
                  <span>Exit Studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
