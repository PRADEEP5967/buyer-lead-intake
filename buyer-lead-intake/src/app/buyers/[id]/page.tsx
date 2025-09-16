import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, Home, Calendar, Tag, FileText, Clock as ClockIcon, User, MapPin, DollarSign, Building2, X } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { getInitials, getStatusColor, getPropertyTypeIcon, formatCurrency } from '@/lib/utils';

interface BuyerPageProps {
  params: {
    id: string;
  };
}

interface Buyer {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  city: string;
  propertyType: string;
  bhk: string | null;
  purpose: string;
  budgetMin: number | null;
  budgetMax: number | null;
  timeline: string;
  source: string;
  status: string;
  notes: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  owner: {
    name: string | null;
    email: string;
    image: string | null;
  };
  histories: Array<{
    id: string;
    changedAt: string;
    changedBy: {
      name: string | null;
      email: string;
    };
  }>;
}

export default async function BuyerPage({ params }: BuyerPageProps) {
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
  const buyer: Buyer = {
    id: params.id,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '3 BHK',
    purpose: 'Buy',
    budgetMin: 5000000,
    budgetMax: 7500000,
    timeline: '3-6m',
    source: 'Website',
    status: 'Contacted',
    notes: 'Interested in properties near sector 70. Prefers ready-to-move-in properties with amenities like clubhouse and swimming pool.',
    tags: ['Premium', 'Follow-up', 'Investor'],
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-20T14:45:00Z',
    owner: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      image: null,
    },
    histories: [
      {
        id: '1',
        changedAt: '2023-05-20T14:45:00Z',
        changedBy: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
        },
      },
      {
        id: '2',
        changedAt: '2023-05-18T11:20:00Z',
        changedBy: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
        },
      },
      {
        id: '3',
        changedAt: '2023-05-15T10:30:00Z',
        changedBy: {
          name: 'System',
          email: 'system@example.com',
        },
      },
    ],
  };

  const getTimelineLabel = (timeline: string) => {
    switch (timeline) {
      case '0-3m':
        return '0-3 months';
      case '3-6m':
        return '3-6 months';
      case '>6m':
        return '6+ months';
      case 'Exploring':
        return 'Just exploring';
      default:
        return timeline;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buyer Details</h1>
          <p className="text-muted-foreground">
            View and manage buyer information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/buyers">Back to List</Link>
          </Button>
          <Button asChild>
            <Link href={`/buyers/${params.id}/edit`}>Edit Buyer</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-2">
          {/* Contact Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/avatars/${buyer.id}.jpg`} alt={buyer.fullName} />
                  <AvatarFallback>{getInitials(buyer.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold">{buyer.fullName}</h2>
                    <Badge variant={getStatusColor(buyer.status) as 'default' | 'destructive' | 'outline' | 'secondary'}>
                      {buyer.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Added on {format(new Date(buyer.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Phone
                  </p>
                  <p className="font-medium">{buyer.phone}</p>
                </div>
                {buyer.email && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium">{buyer.email}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location
                  </p>
                  <p className="font-medium">{buyer.city}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Building2 className="mr-2 h-4 w-4" />
                    Property Type
                  </p>
                  <div className="flex items-center">
                    <span className="mr-1">{getPropertyTypeIcon(buyer.propertyType)}</span>
                    <span className="font-medium">{buyer.propertyType}</span>
                    {buyer.bhk && <span className="ml-1 text-muted-foreground">• {buyer.bhk}</span>}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Budget
                  </p>
                  <p className="font-medium">
                    {buyer.budgetMin && buyer.budgetMax
                      ? `${formatCurrency(buyer.budgetMin)} - ${formatCurrency(buyer.budgetMax)}`
                      : 'Not specified'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Timeline
                  </p>
                  <p className="font-medium">{getTimelineLabel(buyer.timeline)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    Source
                  </p>
                  <p className="font-medium">{buyer.source}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Assigned To
                  </p>
                  <div className="flex items-center">
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage src={buyer.owner.image || ''} alt={buyer.owner.name || ''} />
                      <AvatarFallback>{getInitials(buyer.owner.name || buyer.owner.email)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{buyer.owner.name || buyer.owner.email}</span>
                  </div>
                </div>
              </div>

              {buyer.tags && buyer.tags.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Tag className="mr-2 h-4 w-4" />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {buyer.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Card */}
          {buyer.notes && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  <h3 className="text-lg font-semibold">Notes</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-sm text-muted-foreground">
                  {buyer.notes}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Activity */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <ClockIcon className="mr-2 h-5 w-5" />
                <h3 className="text-lg font-semibold">Activity</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {buyer.histories.map((history, index) => (
                  <div key={history.id} className="relative">
                    {index < buyer.histories.length - 1 && (
                      <div className="absolute left-5 top-4 -ml-px h-full w-0.5 bg-border" />
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/avatars/${history.changedBy.email}.jpg`} alt={history.changedBy.name || ''} />
                          <AvatarFallback>
                            {getInitials(history.changedBy.name || history.changedBy.email)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm">
                          <span className="font-medium">
                            {history.changedBy.name || history.changedBy.email}
                          </span>
                          <span className="text-muted-foreground"> updated this lead</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(history.changedAt), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Schedule Site Visit
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <X className="mr-2 h-4 w-4" />
                Mark as Dropped
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
