'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BuyerForm, type BuyerFormValues } from './buyer-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BuyerFormClientProps {
  initialData?: Partial<BuyerFormValues> & { id?: string };
  isEditing?: boolean;
}

export function BuyerFormClient({ initialData, isEditing = false }: BuyerFormClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: BuyerFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Map timeline values to match Prisma enum
      const mapTimeline = (timeline: string): string => {
        const mapping: Record<string, string> = {
          '0-3m': 'ZeroToThree',
          '3-6m': 'ThreeToSix',
          '6m+': 'MoreThanSix',
          'exploring': 'Exploring'
        };
        return mapping[timeline] || 'Exploring';
      };

      // 1. Prepare the data object with proper types
      const data: any = {
        // Required fields
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        city: formData.city,
        propertyType: formData.propertyType,
        purpose: formData.purpose,
        timeline: mapTimeline(formData.timeline),
        source: formData.source === 'Walk-in' ? 'WalkIn' : formData.source,
        
        // Optional fields with proper null handling
        email: formData.email?.trim() || null,
        notes: formData.notes?.trim() || null,
        budgetMin: formData.budgetMin ? Number(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? Number(formData.budgetMax) : null,
        tags: Array.isArray(formData.tags) ? formData.tags.filter(Boolean) : [],
        status: formData.status || 'New',
        
        // Handle BHK based on property type
        // Only include BHK for Apartment/Villa property types
        ...((formData.propertyType === 'Apartment' || formData.propertyType === 'Villa')
          ? { 
              bhk: formData.bhk 
                ? formData.bhk.charAt(0).toUpperCase() + formData.bhk.slice(1).toLowerCase() 
                : undefined 
            }
          : {} // Don't include bhk field for other property types
        ),
        
        // Add ID if editing
        ...(isEditing && initialData?.id && { id: initialData.id })
      };
      
      // 2. Log the data being sent for debugging
      console.log('Submitting form data:', JSON.stringify(data, null, 2));
      
      // 3. Make the API request
      const url = isEditing && initialData?.id 
        ? `/api/buyers/${initialData.id}` 
        : '/api/buyers';
      
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // 4. Handle the response
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Received an invalid response from the server');
      }

      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          response: responseData,
          requestData: data,
          url: response.url
        });
        
        // Format a user-friendly error message
        let errorMessage = 'Failed to save buyer';
        
        // Handle different types of error responses
        if (response.status === 400) {
          errorMessage = 'Validation error: ';
          if (responseData?.message) {
            errorMessage += responseData.message;
          } else if (responseData?.issues?.length) {
            errorMessage += responseData.issues
              .map((issue: any) => 
                `${issue.path?.join('.') || 'Field'}: ${issue.message || 'Invalid value'}`
              )
              .join('; ');
          } else {
            errorMessage += 'Please check your input and try again.';
          }
        } else if (response.status === 401) {
          errorMessage = 'You need to be logged in to perform this action';
          router.push(`/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to perform this action';
        } else if (response.status === 404) {
          errorMessage = 'The requested resource was not found';
        } else if (response.status >= 500) {
          errorMessage = 'A server error occurred. Please try again later.';
        }
        
        // Fallback to server-provided error message if available
        if (!errorMessage && responseData?.error) {
          errorMessage = responseData.error;
        } else if (!errorMessage && responseData?.message) {
          errorMessage = responseData.message;
        }
        
        throw new Error(errorMessage);
      }

      // 5. Show success message and redirect
      toast({
        title: isEditing ? 'Buyer updated' : 'Buyer created',
        description: isEditing 
          ? 'The buyer has been updated successfully.' 
          : 'A new buyer has been added successfully.',
      });

      // 6. Redirect to the buyer's detail page
      const buyerId = responseData.id || initialData?.id;
      if (buyerId) {
        router.push(`/buyers/${buyerId}`);
        router.refresh();
      } else {
        router.push('/buyers');
      }
      
    } catch (error) {
      console.error('Error in form submission:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
      
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/10">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-md bg-primary/10">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {isEditing ? 'Edit Buyer' : 'Buyer Information'}
            </CardTitle>
            <CardDescription>
              {isEditing 
                ? "Update the buyer's details and preferences"
                : "Fill in the buyer's details and preferences to create a new lead"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <BuyerForm 
          initialData={initialData}
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
      </CardContent>
      <CardFooter className="border-t bg-muted/5 px-6 py-4">
        <div className="flex flex-col w-full space-y-2">
          {error && (
            <div className="text-sm text-red-500 mb-2">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">
                {isEditing ? 'Edit' : 'New'}
              </Badge>
              <span>All fields marked with * are required</span>
            </div>
            <Button 
              type="submit" 
              form="buyer-form"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditing ? 'Update Buyer' : 'Create Buyer'}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
