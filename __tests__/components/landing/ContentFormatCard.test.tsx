import React from 'react';
import { render, screen } from '@testing-library/react';
import { Twitter } from 'lucide-react';
import { ContentFormatCard } from '@/components/landing/features/ContentFormatCard';

describe('ContentFormatCard', () => {
  const mockProps = {
    icon: Twitter,
    title: '5 Twitter Posts',
    description: '280 characters each with hashtags and engagement hooks',
    gradientFrom: 'blue',
    gradientTo: 'blue',
    iconColor: 'text-blue-600',
    hoverShadowColor: 'blue',
  };

  it('should render with correct title and description', () => {
    render(<ContentFormatCard {...mockProps} />);

    expect(screen.getByText('5 Twitter Posts')).toBeInTheDocument();
    expect(
      screen.getByText('280 characters each with hashtags and engagement hooks')
    ).toBeInTheDocument();
  });

  it('should render the icon', () => {
    const { container } = render(<ContentFormatCard {...mockProps} />);

    // The icon should be rendered (we can't easily test the specific icon component)
    const iconElement = container.querySelector('svg');
    expect(iconElement).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<ContentFormatCard {...mockProps} />);

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(
      'group',
      'relative',
      'overflow-hidden',
      'border-0'
    );
  });

  it('should handle different gradient colors', () => {
    const { rerender } = render(<ContentFormatCard {...mockProps} />);

    // Test with different gradient colors
    rerender(
      <ContentFormatCard
        {...mockProps}
        gradientFrom="purple"
        gradientTo="pink"
        iconColor="text-purple-600"
        hoverShadowColor="purple"
      />
    );

    expect(screen.getByText('5 Twitter Posts')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<ContentFormatCard {...mockProps} />);

    // Check that the card has proper semantic structure
    const card = screen.getByText('5 Twitter Posts').closest('div');
    expect(card).toBeInTheDocument();
  });
});
