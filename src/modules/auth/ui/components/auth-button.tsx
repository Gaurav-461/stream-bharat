import { Button } from "@/components/ui/button";
import { UserCircleIcon } from "lucide-react";

export const AuthButton = () => {
  return (
    <Button
      variant={"outline"}
      className="rounded-full border-orange-500/20 px-4 py-2 text-sm font-medium text-orange-600 shadow-none hover:text-orange-500"
    >
      <UserCircleIcon />
      Sign in
    </Button>
  );
};
