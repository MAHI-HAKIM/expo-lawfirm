"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, History, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { deleteLawyer } from "@/services/lawyers.service";

interface LawyersActionsProps {
  lawyer: {
    id: number;
    email: string;
    full_name?: string;
  };
}

export function LawyersActions({ lawyer }: LawyersActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete user ${
          lawyer.full_name || lawyer.email
        }?`
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);

      // Call the delete function
      const success = await deleteLawyer(lawyer.id);

      console.log("Delete operation completed with success:", success);

      // If we get here without an error, refresh the page
      if (success) {
        // Give a small delay to ensure state updates complete
        toast.success("Lawyer deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);

      // Show a more descriptive error message
      alert(
        `Failed to delete user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          style={{
            color: "#F0D078",
          }}
          disabled={isDeleting}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        style={{
          backgroundColor: "#252525",
          border: "1px solid rgba(240, 208, 120, 0.2)",
          borderRadius: "0.5rem",
        }}
      >
        <DropdownMenuItem
          onClick={() => router.push(`/admin/users/${lawyer.id}`)}
          className="cursor-pointer"
          style={{
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <User className="mr-2 h-4 w-4" style={{ color: "#F0D078" }} />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/users/${lawyer.id}/history`)}
          className="cursor-pointer"
          style={{
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <History className="mr-2 h-4 w-4" style={{ color: "#F0D078" }} />
          View History
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/users/${lawyer.id}/edit`)}
          className="cursor-pointer"
          style={{
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <Edit className="mr-2 h-4 w-4" style={{ color: "#F0D078" }} />
          Edit lawyer
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="cursor-pointer"
          style={{
            color: "#F87171",
            fontFamily: "sans-serif",
          }}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete Lawyer"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
