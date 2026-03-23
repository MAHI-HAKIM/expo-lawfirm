import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UsersTableSkeleton() {
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
          {[...Array(5)].map((_, index) => (
            <TableRow
              key={index}
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
            >
              <TableCell>
                <Skeleton
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    height: "20px",
                    width: "120px",
                  }}
                />
              </TableCell>
              <TableCell>
                <Skeleton
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    height: "20px",
                    width: "160px",
                  }}
                />
              </TableCell>
              <TableCell>
                <Skeleton
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    height: "20px",
                    width: "60px",
                    borderRadius: "4px",
                  }}
                />
              </TableCell>
              <TableCell>
                <Skeleton
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    height: "20px",
                    width: "100px",
                  }}
                />
              </TableCell>
              <TableCell>
                <Skeleton
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    height: "20px",
                    width: "60px",
                    borderRadius: "4px",
                  }}
                />
              </TableCell>
              <TableCell style={{ textAlign: "right" }}>
                <Skeleton
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    height: "28px",
                    width: "28px",
                    borderRadius: "4px",
                    marginLeft: "auto",
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
