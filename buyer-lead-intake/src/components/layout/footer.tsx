'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} RealEstate Pro | Developed by Er Pradeep Sahani</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/help/buyer-management" className="hover:text-foreground transition-colors">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
