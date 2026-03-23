import "./globals.css";
import ToastProvider from "@/contexts/ToastProvider";

export const metadata = {
  title: "Expolaw",
  description: "Your Bridge to Justice.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <main className="overflow-hidden">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
