import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Buyer Management Help - RealEstate Pro',
  description: 'Learn how to effectively manage buyer leads in RealEstate Pro',
};

export default function BuyerManagementHelp() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Button variant="outline" asChild className="mb-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">Buyer Management Guide</h1>
        <p className="text-muted-foreground">
          Learn how to effectively manage your buyer leads in RealEstate Pro
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Adding a New Buyer</CardTitle>
            <CardDescription>Step-by-step guide to add a new buyer lead</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2">
              <li>Navigate to the <strong>Buyers</strong> section in the main menu</li>
              <li>Click the <strong>+ Add New Buyer</strong> button</li>
              <li>Fill in the buyer's details in the form</li>
              <li>Click <strong>Create Buyer</strong> to save the information</li>
              <li>You'll be redirected to the buyer's details page upon successful creation</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Updating Buyer Information</CardTitle>
            <CardDescription>How to edit existing buyer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to the buyer's details page</li>
              <li>Click the <strong>Edit</strong> button</li>
              <li>Make the necessary changes to the information</li>
              <li>Click <strong>Update Buyer</strong> to save your changes</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managing Buyer Status</CardTitle>
            <CardDescription>How to track and update buyer status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Track the progress of each buyer through different statuses:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>New</strong> - Recently added buyer</li>
              <li><strong>Qualified</strong> - Buyer has been vetted</li>
              <li><strong>Contacted</strong> - Initial contact made</li>
              <li><strong>Visited</strong> - Property viewing scheduled</li>
              <li><strong>Negotiation</strong> - In price or terms discussion</li>
              <li><strong>Converted</strong> - Successful deal closed</li>
              <li><strong>Dropped</strong> - No longer active</li>
            </ul>
            <p>Update the status from the buyer's details page.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>Contact our support team for additional assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Email: pradeepsahani8130s@gmail.com</p>
              <p>Phone: +91 8130885013</p>
              <p>Available Monday - Sunday, 10:00 AM - 8:00 PM IST</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
