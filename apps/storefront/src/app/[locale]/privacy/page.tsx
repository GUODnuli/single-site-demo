import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('footer');
  return {
    title: t('privacy'),
  };
}

export default async function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p className="text-muted-foreground">Last updated: January 2024</p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you fill out a
          contact form, request a quote, or communicate with us via email.
        </p>

        <h3>Personal Information</h3>
        <ul>
          <li>Name and contact details (email, phone number)</li>
          <li>Company name (if applicable)</li>
          <li>Project requirements and preferences</li>
          <li>Communication history</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <ul>
          <li>IP address and browser type</li>
          <li>Device information</li>
          <li>Pages visited and time spent</li>
          <li>Referring website</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Respond to your inquiries and provide customer support</li>
          <li>Process your requests for quotes or samples</li>
          <li>Improve our website and services</li>
          <li>Send you marketing communications (with your consent)</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell your personal information. We may share your information with:
        </p>
        <ul>
          <li>Service providers who assist our operations</li>
          <li>Legal authorities when required by law</li>
          <li>Business partners (with your consent)</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your
          personal information against unauthorized access, alteration, disclosure, or
          destruction.
        </p>

        <h2>5. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Data portability</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>
          We use cookies and similar technologies to enhance your browsing experience and
          analyze website traffic. You can control cookie settings through your browser.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@curtainshowcase.com</li>
          <li>Address: 123 Business Park, Suite 456, New York, NY 10001</li>
        </ul>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any
          changes by posting the new Privacy Policy on this page.
        </p>
      </div>
    </div>
  );
}
