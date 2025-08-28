import Link from "next/link";
import { useUser } from "@clerk/nextjs";

import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";

export const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </SidebarHeader>
    );
  }

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Your Profile">
          <Link href="/user/current">
            <UserAvatar
              imageUrl={user?.imageUrl ?? ""}
              name={user?.fullName ?? "User"}
              size={"sm"}
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href="/user/current">
        <UserAvatar
          imageUrl={user?.imageUrl ?? ""}
          name={user?.fullName ?? "User"}
          className="size-[112px] transition-opacity hover:opacity-80"
        />
      </Link>
      <div className="flex flex-col items-center">
        <p className="text-sm font-medium">Your Profile</p>
        <p className="text-xs text-muted-foreground">
          {user?.fullName ?? "User"}
        </p>
      </div>
    </SidebarHeader>
  );
};
