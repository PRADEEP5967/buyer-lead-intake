import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const metadata: Metadata = {
  title: 'Profile | Buyer Lead Intake',
  description: 'View and manage your profile',
};

export default function ProfilePage() {
  // This would typically come from your auth provider
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    avatar: '',
    lastLogin: new Date().toLocaleDateString(),
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information and settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {user.role}
                  </span>
                </div>
                <Button variant="outline" className="w-full">
                  Change Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-sm text-muted-foreground">{user.lastLogin}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">January 2023</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Account Status</p>
                <div className="flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} disabled />
                  <p className="text-xs text-muted-foreground">
                    Contact support to change your email address
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Real estate professional with over 5 years of experience in luxury properties."
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
