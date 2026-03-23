"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { signOut } from "@/services/auth.service";
import { UserData } from "@/types";

interface UserAccountNavProps {
  user: UserData | null;
}

// Function to get initials from name
const getInitials = (name?: string): string => {
  if (!name) return "U";

  // Split the name by spaces
  const parts = name.split(" ");

  if (parts.length === 1) {
    // If only one name, use the first letter
    return parts[0].charAt(0).toUpperCase();
  } else {
    // Use first letter of first name and first letter of last name
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
};

export function UserAccountNav({ user }: UserAccountNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const userInitials = getInitials(user?.full_name);

  if (!user) {
    return (
      <Avatar className="p-5 border-3 border-amber-300/30 bg-slate-800">
        <AvatarFallback className="bg-gray-900 text-amber-300">
          ...
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-full p-0 transition-transform hover:scale-105"
        >
          <Avatar
            className={`p-5 border-3 bg-slate-800 transition-all duration-200 ${
              isOpen ? "border-amber-300 shadow-md" : "border-amber-300/30"
            }`}
          >
            <AvatarFallback className="bg-gray-900 text-amber-300">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 border border-amber-700 bg-black shadow-lg rounded-md"
        align="end"
        forceMount
      >
        <div className="border-b border-gray-700">
          {user.email && (
            <p className="mt-2 p-2 w-full truncate text-[12px] text-amber-200">
              signed in as {user.email}
            </p>
          )}
        </div>

        <div className="py-3">
          <DropdownMenuItem
            asChild
            className="px-2 py-1 text-xs cursor-pointer"
          >
            <Link
              href="/dashboard"
              className="flex w-full text-white hover:text-amber-300 hover:bg-gray-800"
            >
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="px-2 py-1 text-xs cursor-pointer"
          >
            <Link
              href="/profile"
              className="flex w-full text-white hover:text-amber-300 hover:bg-gray-800"
            >
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="px-2 py-1 text-xs cursor-pointer"
          >
            <Link
              href="/appointments"
              className="flex w-full text-white hover:text-amber-300 hover:bg-gray-800"
            >
              My Appointments
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-gray-700 my-0.5" />

        <div className="py-0.5">
          <DropdownMenuItem
            className="px-2 py-1 text-xs cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/30"
            onSelect={(e: { preventDefault: () => void }) => {
              e.preventDefault();
              signOut();
            }}
          >
            <button
              className="flex w-full text-left"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              Logout
            </button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
