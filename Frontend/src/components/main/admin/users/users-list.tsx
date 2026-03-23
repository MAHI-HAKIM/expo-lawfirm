import { listUsers } from "@/services/users.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserActions } from "@/components/main/admin/users/user-actions";
import { getCurrentUser } from "@/services/auth.service";
import { format } from "date-fns";

interface User {
  id: number;
  email: string;
  full_name?: string;
  role?: string;
  created_at?: string;
  is_active?: boolean;
}

export async function UsersList() {
  // Fetch users data with error handling
  let users = [];
  const currentUser = await getCurrentUser();

  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  try {
    users = await listUsers();

    users = users.filter(
      (user: User) => user.id !== currentUser?.id && user.role == "client"
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    // Return a fallback UI for error state
    return (
      <div className="w-full p-8 text-center">
        <p
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: "sans-serif",
          }}
        >
          Failed to load users. Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <TableHead
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "sans-serif",
                fontSize: "0.8rem",
              }}
            >
              Name
            </TableHead>
            <TableHead
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "sans-serif",
                fontSize: "0.8rem",
              }}
            >
              Email
            </TableHead>
            <TableHead
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "sans-serif",
                fontSize: "0.8rem",
              }}
            >
              Role
            </TableHead>
            <TableHead
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "sans-serif",
                fontSize: "0.8rem",
              }}
            >
              Joined
            </TableHead>
            <TableHead
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "sans-serif",
                fontSize: "0.8rem",
              }}
            >
              Status
            </TableHead>
            <TableHead
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "sans-serif",
                fontSize: "0.8rem",
                textAlign: "right",
                paddingRight: "1rem",
              }}
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user: User) => (
              <TableRow
                key={user.id}
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "background-color 0.2s",
                }}
                className="hover:bg-gray-900"
              >
                <TableCell
                  style={{
                    color: "white",
                    fontFamily: "sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {user.full_name || "N/A"}
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontFamily: "sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  {user.email}
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontFamily: "sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        user.role === "client"
                          ? "rgba(240, 208, 120, 0.2)"
                          : "rgba(52, 211, 153, 0.2)",
                      color: user.role === "client" ? "#F0D078" : "#34D399",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {user.role || "client"}
                  </span>
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    fontFamily: "sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  {formatDate(new Date())}
                </TableCell>
                <TableCell
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: user.is_active
                        ? "rgba(52, 211, 153, 0.2)"
                        : "rgba(248, 113, 113, 0.2)",
                      color: user.is_active ? "#34D399" : "#F87171",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                    }}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <UserActions user={user} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center"
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "sans-serif",
                }}
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper function for formatting dates
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
