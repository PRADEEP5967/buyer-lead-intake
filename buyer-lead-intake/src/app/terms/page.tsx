import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - RealEstate Pro',
  description: 'Terms and conditions for using RealEstate Pro services',
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose dark:prose-invert">
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to RealEstate Pro. These Terms of Service ("Terms") govern your access to and use of our website and services.
            By accessing or using our services, you agree to be bound by these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Our Services</h2>
          <p className="mb-4">
            You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>In any way that violates any applicable law or regulation</li>
            <li>To transmit any advertising or promotional material without our prior written consent</li>
            <li>To impersonate or attempt to impersonate RealEstate Pro or any other person or entity</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="mb-4">
            The content, features, and functionality of our services are owned by RealEstate Pro and are protected by copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">
            In no event will RealEstate Pro be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Changes to These Terms</h2>
          <p className="mb-4">
            We may update our Terms of Service from time to time. We will notify you of any changes by posting the new Terms on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mb-2">Email: pradeepsahani8130s@gmail.com</p>
          <p className="mb-2">Contact: +91 8130885013</p>
          <p>Address: 123 Real Estate, New Delhi, India</p>
        </section>
      </div>
    </div>
  );
}
