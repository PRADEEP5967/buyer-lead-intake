import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaQuestionCircle, FaBook, FaVideo, FaEnvelope, FaDiscord, FaTwitter } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Help & Support | Buyer Lead Intake',
  description: 'Get help and support for the Buyer Lead Intake application',
};

const faqs = [
  {
    question: 'How do I add a new lead?',
    answer: 'Navigate to the "Buyers" section and click the "Add New" button. Fill in the required information and click "Save" to add a new lead.'
  },
  {
    question: 'How do I filter my leads?',
    answer: 'Use the search and filter options at the top of the Buyers page to filter leads by status, city, property type, or search terms.'
  },
  {
    question: 'How do I update a lead\'s status?',
    answer: 'Click on a lead to view its details, then use the status dropdown to update the lead\'s status. Don\'t forget to save your changes.'
  },
  {
    question: 'Can I export my leads?',
    answer: 'Yes, you can export your leads to CSV format by clicking the "Export" button on the Buyers page.'
  },
  {
    question: 'How do I change my account settings?',
    answer: 'Navigate to the "Settings" page from the main menu to update your profile information, password, and notification preferences.'
  },
  {
    question: 'Where can I view reports?',
    answer: 'Go to the "Reports" section to view various reports and analytics about your leads and conversions.'
  },
];

const resources = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides and API documentation',
    icon: <FaBook className="h-6 w-6 text-primary" />,
    link: '#'
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    icon: <FaVideo className="h-6 w-6 text-primary" />,
    link: '#'
  },
  {
    title: 'FAQ',
    description: 'Frequently asked questions',
    icon: <FaQuestionCircle className="h-6 w-6 text-primary" />,
    link: '#faqs'
  },
  {
    title: 'Contact Support',
    description: 'Get in touch with our support team',
    icon: <FaEnvelope className="h-6 w-6 text-primary" />,
    link: 'mailto:support@buyerleadintake.com'
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground mt-2">Find answers, guides, and resources to help you get the most out of Buyer Lead Intake</p>
      </div>

      {/* Search Bar */}
      <div className="mb-12 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full rounded-lg border border-input bg-background px-4 py-3 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <FaQuestionCircle className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Button className="absolute right-1 top-1" size="sm">
            Search
          </Button>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Resources</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource, index) => (
            <a key={index} href={resource.link} className="block">
              <Card className="h-full transition-colors hover:bg-accent/50">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-accent p-3">
                    {resource.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faqs" className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>
            Our support team is here to help you with any questions or issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button className="w-full sm:w-auto">
              <FaEnvelope className="mr-2 h-4 w-4" />
              Email Support
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <FaDiscord className="mr-2 h-4 w-4" />
              Join Discord
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <FaTwitter className="mr-2 h-4 w-4" />
              Tweet @ us
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Buyer Lead Intake. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="hover:underline">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Status</a>
        </div>
      </div>
    </div>
  );
}
