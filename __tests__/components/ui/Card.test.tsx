import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

describe('Card Components', () => {
  it('should render Card with children', () => {
    render(
      <Card data-testid="card">
        <CardContent>Test content</CardContent>
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render CardHeader with title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
      </Card>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render CardContent', () => {
    render(
      <Card>
        <CardContent data-testid="content">Test content</CardContent>
      </Card>
    );

    const content = screen.getByTestId('content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Test content');
  });
});
