import { NextRequest, NextResponse } from 'next/server';

const VENDURE_API_URL = process.env.VENDURE_API_URL || 'http://localhost:3000/shop-api';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

const SUBMIT_CONTACT_FORM = `
  mutation SubmitContactForm($input: SubmitContactFormInput!) {
    submitContactForm(input: $input) {
      success
      message
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get client info from headers
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;

    // Combine subject and message for the plugin
    const fullMessage = `[${data.subject.toUpperCase()}]\n\n${data.message}`;

    const response = await fetch(VENDURE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': clientIp,
        'User-Agent': userAgent || '',
      },
      body: JSON.stringify({
        query: SUBMIT_CONTACT_FORM,
        variables: {
          input: {
            name: data.name,
            email: data.email,
            phone: data.phone || undefined,
            company: data.company || undefined,
            message: fullMessage,
            source: 'website-contact-form',
          },
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return NextResponse.json(
        { error: 'Failed to submit contact form', details: result.errors },
        { status: 500 }
      );
    }

    if (!result.data?.submitContactForm?.success) {
      return NextResponse.json(
        { error: result.data?.submitContactForm?.message || 'Submission failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.data.submitContactForm.message || 'Contact form submitted successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
