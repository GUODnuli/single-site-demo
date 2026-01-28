import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('footer');
  return {
    title: t('terms'),
  };
}

export default async function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>

      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p className="text-muted-foreground">Last updated: January 2024</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using the Curtain Showcase website, you accept and agree to be
          bound by the terms and provisions of this agreement.
        </p>

        <h2>2. Use of Website</h2>
        <p>
          This website is intended for informational purposes and to facilitate business
          inquiries. You agree to use the website only for lawful purposes.
        </p>
        <p>You agree not to:</p>
        <ul>
          <li>Use the website in any way that violates applicable laws</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Interfere with the proper functioning of the website</li>
          <li>Collect user information without consent</li>
        </ul>

        <h2>3. Product Information</h2>
        <p>
          We strive to provide accurate product descriptions and pricing information.
          However, we do not warrant that product descriptions, pricing, or other content
          is accurate, complete, reliable, or error-free.
        </p>
        <p>
          All prices shown are for reference purposes only. Final pricing will be provided
          upon request based on your specific requirements.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          All content on this website, including but not limited to text, graphics, logos,
          images, and software, is the property of Curtain Showcase and is protected by
          intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, modify, or create derivative works from any
          content without our prior written consent.
        </p>

        <h2>5. User Submissions</h2>
        <p>
          Any information you submit through contact forms or other means becomes our
          property and may be used for business purposes in accordance with our Privacy
          Policy.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          THE WEBSITE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT
          GUARANTEE THAT THE WEBSITE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          IN NO EVENT SHALL CURTAIN SHOWCASE BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE WEBSITE.
        </p>

        <h2>8. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible
          for the content or privacy practices of these external sites.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms of Service shall be governed by and construed in accordance with the
          laws of the State of New York, without regard to its conflict of law provisions.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Changes will be
          effective immediately upon posting on this page.
        </p>

        <h2>11. Contact Information</h2>
        <p>
          For questions about these Terms of Service, please contact us at:
        </p>
        <ul>
          <li>Email: legal@curtainshowcase.com</li>
          <li>Address: 123 Business Park, Suite 456, New York, NY 10001</li>
        </ul>
      </div>
    </div>
  );
}
