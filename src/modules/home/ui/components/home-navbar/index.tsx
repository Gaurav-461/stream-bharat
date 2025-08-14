import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./Search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const HomeNavbar = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center bg-white px-2 pr-4">
      <div className="flex items-center gap-4 w-full">
        {/* Menu and logo */}
        <div className="flex items-center flex-shrink-0">
            <SidebarTrigger/>
            <Link href="/">
                <Image className="translate-y-1" src="/stream-bharat-logo.png" alt="logo" width={80} height={80} />
            </Link>
        </div>

        {/* Search bar */}
        <div className="flex-1 flex justify-between max-w-[720px] mx-auto">
            <SearchInput />
        </div>

        {/* Auth button */}
        <div className="flex items-center flex-shrink-0 gap-4">
            <AuthButton />
        </div>
      </div>
    </nav>
  );
};
