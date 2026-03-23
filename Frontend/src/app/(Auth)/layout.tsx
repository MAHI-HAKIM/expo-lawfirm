import AuthLayout from '@/components/main/Auth/AuthLayout';

export default function RootLayout({ children } : {children : React.ReactNode}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthLayout>
        {children}
      </AuthLayout>
    </div>
  );
}
