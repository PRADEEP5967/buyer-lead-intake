import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, DollarSign, Home, ArrowUpRight, Mail, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // In a real app, you would fetch this data from your API
  const dashboardStats = [
    { name: 'Total Leads', value: '1,234', change: '+12%', changeType: 'increase' },
    { name: 'New This Week', value: '156', change: '+8.2%', changeType: 'increase' },
    { name: 'Avg. Deal Size', value: '₹72.5L', change: '+5.4%', changeType: 'increase' },
    { name: 'Conversion Rate', value: '24.3%', change: '+3.2%', changeType: 'increase' },
  ];

  const recentActivities = [
    { id: 1, name: 'John Doe', type: 'New Lead', status: 'New', time: '2 min ago' },
    { id: 2, name: 'Jane Smith', type: 'Status Update', status: 'Contacted', time: '1 hour ago' },
    { id: 3, name: 'Robert Johnson', type: 'Site Visit Scheduled', status: 'Qualified', time: '3 hours ago' },
    { id: 4, name: 'Emily Davis', type: 'New Lead', status: 'New', time: '5 hours ago' },
    { id: 5, name: 'Michael Wilson', type: 'Deal Closed', status: 'Converted', time: '1 day ago' },
  ];

  const quickActions = [
    { 
      title: 'Schedule Site Visit', 
      icon: <Home className="h-4 w-4 text-muted-foreground" />,
      description: 'Schedule a property visit for potential buyers'
    },
    { 
      title: 'Send Bulk Emails', 
      icon: <Mail className="h-4 w-4 text-muted-foreground" />,
      description: 'Send updates or offers to multiple buyers'
    },
    { 
      title: 'Generate Report', 
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      description: 'Create a detailed report of your leads'
    },
    { 
      title: 'View Calendar', 
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      description: 'Check your schedule and appointments'
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/buyers/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Buyer
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              {index === 0 && <Users className="h-4 w-4 text-muted-foreground" />}
              {index === 1 && <Plus className="h-4 w-4 text-muted-foreground" />}
              {index === 2 && <DollarSign className="h-4 w-4 text-muted-foreground" />}
              {index === 3 && <Badge className="h-4 w-4 bg-green-100 text-green-800">%</Badge>}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates and changes in your leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {activity.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">{activity.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks you might want to perform
              </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid gap-4">
              {quickActions.map((action) => (
                <div 
                  key={action.title}
                  className="flex items-center p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>
                Your most recently added leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {activity.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">{activity.status}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/buyers/${activity.id}`}>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/buyers">
                    View All Leads
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
