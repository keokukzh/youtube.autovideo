import React from 'react';
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

describe('Alert', () => {
  it('should render with default variant', () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description content</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('role', 'alert');
    expect(alert).toHaveClass('bg-background', 'text-foreground');
  });

  it('should render with destructive variant', () => {
    render(
      <Alert variant="destructive" data-testid="alert">
        <AlertTitle>Error Alert</AlertTitle>
        <AlertDescription>This is an error message</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
  });

  it('should render alert title', () => {
    render(
      <Alert>
        <AlertTitle data-testid="alert-title">Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );

    const title = screen.getByTestId('alert-title');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H5');
    expect(title).toHaveClass(
      'mb-1',
      'font-medium',
      'leading-none',
      'tracking-tight'
    );
  });

  it('should render alert description', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription data-testid="alert-description">
          Alert description content
        </AlertDescription>
      </Alert>
    );

    const description = screen.getByTestId('alert-description');
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('DIV');
    expect(description).toHaveClass('text-sm');
  });

  it('should apply custom className', () => {
    render(
      <Alert className="custom-alert-class" data-testid="alert">
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('custom-alert-class');
  });

  it('should apply custom className to title', () => {
    render(
      <Alert>
        <AlertTitle className="custom-title-class" data-testid="alert-title">
          Alert Title
        </AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );

    const title = screen.getByTestId('alert-title');
    expect(title).toHaveClass('custom-title-class');
  });

  it('should apply custom className to description', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription
          className="custom-description-class"
          data-testid="alert-description"
        >
          Alert description
        </AlertDescription>
      </Alert>
    );

    const description = screen.getByTestId('alert-description');
    expect(description).toHaveClass('custom-description-class');
  });

  it('should forward ref to alert', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Alert ref={ref} data-testid="alert">
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );

    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveAttribute('role', 'alert');
  });

  it('should forward ref to title', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(
      <Alert>
        <AlertTitle ref={ref} data-testid="alert-title">
          Alert Title
        </AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );

    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe('H5');
  });

  it('should forward ref to description', () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription ref={ref} data-testid="alert-description">
          Alert description
        </AlertDescription>
      </Alert>
    );

    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('should pass through HTML attributes', () => {
    render(
      <Alert data-testid="alert" aria-label="Custom alert">
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('aria-label', 'Custom alert');
  });

  it('should render with icon and proper spacing', () => {
    render(
      <Alert data-testid="alert">
        <svg data-testid="alert-icon" className="h-4 w-4" />
        <AlertTitle>Alert with Icon</AlertTitle>
        <AlertDescription>This alert has an icon</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    const icon = screen.getByTestId('alert-icon');

    expect(alert).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-4', 'w-4');
  });

  it('should handle empty content', () => {
    render(<Alert data-testid="alert" />);

    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute('role', 'alert');
  });

  it('should handle only title without description', () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Title Only</AlertTitle>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    const title = screen.getByText('Title Only');

    expect(alert).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it('should handle only description without title', () => {
    render(
      <Alert data-testid="alert">
        <AlertDescription>Description Only</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    const description = screen.getByText('Description Only');

    expect(alert).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Accessible Alert</AlertTitle>
        <AlertDescription>This alert is accessible</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('role', 'alert');
  });

  it('should render with dark mode classes for destructive variant', () => {
    render(
      <Alert variant="destructive" data-testid="alert">
        <AlertTitle>Dark Mode Alert</AlertTitle>
        <AlertDescription>This alert has dark mode styling</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('dark:border-destructive');
  });
});
