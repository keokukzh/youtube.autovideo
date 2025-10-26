import React from 'react';
import { render, screen } from '@testing-library/react';
import TestimonialsSection from '@/components/landing/testimonials/TestimonialsSection';

// Mock the TestimonialCard component
jest.mock('@/components/landing/testimonials/TestimonialCard', () => ({
  TestimonialCard: ({ name, role, company, content, avatar }: any) => (
    <div data-testid={`testimonial-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div data-testid="avatar">{avatar}</div>
      <h4>{name}</h4>
      <p>
        {role} at {company}
      </p>
      <blockquote>{content}</blockquote>
    </div>
  ),
}));

describe('TestimonialsSection', () => {
  it('renders with all main elements', () => {
    render(<TestimonialsSection />);

    // Check for main section
    const section = screen.getByText('What Our Users Say').closest('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(
      'bg-gray-50',
      'px-4',
      'py-20',
      'sm:px-6',
      'lg:px-8'
    );

    // Check for heading
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('What Our Users Say');
    expect(heading).toHaveClass(
      'mb-4',
      'text-3xl',
      'font-bold',
      'text-gray-900',
      'sm:text-4xl'
    );

    // Check for description
    const description = screen.getByText(/Don't just take our word for it/);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass(
      'mx-auto',
      'max-w-2xl',
      'text-xl',
      'text-gray-600',
      'mb-16'
    );
  });

  it('renders all testimonial cards', () => {
    render(<TestimonialsSection />);

    // Check for all testimonial cards
    expect(screen.getByTestId('testimonial-sarah-johnson')).toBeInTheDocument();
    expect(screen.getByTestId('testimonial-mike-chen')).toBeInTheDocument();
    expect(
      screen.getByTestId('testimonial-emily-rodriguez')
    ).toBeInTheDocument();
  });

  it('renders with responsive grid layout', () => {
    render(<TestimonialsSection />);

    const gridContainer = screen.getByTestId(
      'testimonial-sarah-johnson'
    ).parentElement;
    expect(gridContainer).toHaveClass(
      'grid',
      'grid-cols-1',
      'gap-8',
      'md:grid-cols-2',
      'lg:grid-cols-3'
    );
  });

  it('renders with proper accessibility attributes', () => {
    render(<TestimonialsSection />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();

    const testimonialCards = screen.getAllByRole('heading', { level: 4 });
    expect(testimonialCards).toHaveLength(3);
  });
});
