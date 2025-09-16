import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buyer Leads Manager',
  description: 'Manage your real estate buyer leads efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex h-screen overflow-hidden">
              <AppSidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <AppHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20">
                  <div className="max-w-7xl mx-auto w-full">
                    {children}
                  </div>
                </main>
                <Footer />
              </div>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
