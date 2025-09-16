import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - RealEstate Pro',
  description: 'Learn how we protect your privacy and handle your data at RealEstate Pro.',
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert">
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to RealEstate Pro. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">
            We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Identity Data (name, username, or similar identifier)</li>
            <li>Contact Data (email address, phone number)</li>
            <li>Technical Data (IP address, browser type, time zone, location)</li>
            <li>Usage Data (how you use our website and services)</li>
            <li>Marketing and Communications Data (your preferences in receiving marketing from us)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
          <p className="mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features of our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-4">
            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
            used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal 
            data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Legal Rights</h2>
          <p className="mb-4">
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, 
            including the right to access, correct, erase, restrict or object to processing, and the right to data portability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-2">Email: pradeepsahani8130s@gmail.com</p>
          <p className="mb-2">Contact: +91 8130885013</p>
          <p>Address: 123 Real Estate, New Delhi, India</p>
        </section>
      </div>
    </div>
  );
}
