import React from 'react';
import { render, screen } from '@testing-library/react';
import FAQSection from '@/components/landing/faq/FAQSection';

// Mock the FAQItem component
jest.mock('@/components/landing/faq/FAQItem', () => ({
  FAQItem: ({ question, answer }: any) => (
    <div
      data-testid={`faq-${question.toLowerCase().replace(/\s+/g, '-').replace(/\?/g, '')}`}
    >
      <h3>{question}</h3>
      <p>{answer}</p>
    </div>
  ),
}));

describe('FAQSection', () => {
  it('renders with all main elements', () => {
    render(<FAQSection />);

    // Check for main section
    const section = screen
      .getByText('Frequently Asked Questions')
      .closest('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(
      'bg-white',
      'px-4',
      'py-20',
      'sm:px-6',
      'lg:px-8'
    );

    // Check for heading
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Frequently Asked Questions');
    expect(heading).toHaveClass(
      'mb-4',
      'text-3xl',
      'font-bold',
      'text-gray-900',
      'sm:text-4xl'
    );

    // Check for description
    const description = screen.getByText(
      /Everything you need to know about ContentMultiplier.io/
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-xl', 'text-gray-600');
  });

  it('renders all FAQ items', () => {
    render(<FAQSection />);

    // Check for all FAQ items
    expect(
      screen.getByTestId('faq-how-does-contentmultiplier.io-work')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('faq-what-content-formats-do-you-generate')
    ).toBeInTheDocument();
    expect(screen.getByTestId('faq-how-much-does-it-cost')).toBeInTheDocument();
    expect(
      screen.getByTestId('faq-is-my-content-secure-and-private')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('faq-can-i-customize-the-generated-content')
    ).toBeInTheDocument();
    expect(screen.getByTestId('faq-do-you-offer-refunds')).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    render(<FAQSection />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();

    const faqItems = screen.getAllByRole('heading', { level: 3 });
    expect(faqItems).toHaveLength(6);
  });
});
