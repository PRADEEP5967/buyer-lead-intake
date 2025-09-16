import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BuyerFormClient } from '@/components/buyers/buyer-form-client';

interface EditBuyerPageProps {
  params: {
    id: string;
  };
}

export default async function EditBuyerPage({ params }: EditBuyerPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return notFound();
  }

  // In a real app, you would fetch the buyer data from your API
  // const response = await fetch(`/api/buyers/${params.id}`, {
  //   headers: {
  //     'Authorization': `Bearer ${session.accessToken}`,
  //   },
  // });
  
  // if (!response.ok) {
  //   return notFound();
  // }
  
  // Mock data - replace with actual API call
  const buyerData = {
    id: params.id,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    city: 'Chandigarh' as const,
    propertyType: 'Apartment' as const,
    bhk: '3 BHK',
    purpose: 'Buy' as const,
    budgetMin: 5000000,
    budgetMax: 7500000,
    timeline: '3-6m' as const,
    source: 'Website' as const,
    status: 'Contacted' as const,
    notes: 'Interested in properties near sector 70. Prefers ready-to-move-in properties with amenities like clubhouse and swimming pool.',
    tags: ['Premium', 'Follow-up', 'Investor'],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Buyer</h1>
          <p className="text-muted-foreground">
            Update buyer information and preferences
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/buyers/${params.id}`}>Cancel</Link>
          </Button>
        </div>
      </div>

      <BuyerFormClient 
        initialData={{
          ...buyerData,
          id: params.id
        }}
        isEditing
      />
    </div>
  );
}
