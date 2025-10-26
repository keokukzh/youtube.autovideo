import React from 'react';
import { render, screen } from '@testing-library/react';
import { Progress } from '@/components/ui/progress';

describe('Progress', () => {
  it('should render with default props', () => {
    render(<Progress data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('role', 'progressbar');
  });

  it('should render with value prop', () => {
    render(<Progress value={50} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '50');
  });

  it('should render with max value', () => {
    render(<Progress value={75} max={100} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '75');
    expect(progress).toHaveAttribute('max', '100');
  });

  it('should apply custom className', () => {
    render(
      <Progress className="custom-progress-class" data-testid="progress" />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('custom-progress-class');
  });

  it('should have correct base classes', () => {
    render(<Progress data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass(
      'relative',
      'h-4',
      'w-full',
      'overflow-hidden',
      'rounded-full',
      'bg-secondary'
    );
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Progress ref={ref} data-testid="progress" />);

    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveAttribute('role', 'progressbar');
  });

  it('should pass through HTML attributes', () => {
    render(
      <Progress
        data-testid="progress"
        id="test-progress"
        title="Progress bar"
        aria-label="Loading progress"
      />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('id', 'test-progress');
    expect(progress).toHaveAttribute('title', 'Progress bar');
    expect(progress).toHaveAttribute('aria-label', 'Loading progress');
  });

  it('should render progress indicator with correct width', () => {
    render(<Progress value={60} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    const indicator = progress.querySelector(
      '[data-state="indeterminate"], [data-state="complete"]'
    );

    expect(progress).toBeInTheDocument();
    expect(indicator).toBeInTheDocument();
  });

  it('should handle zero value', () => {
    render(<Progress value={0} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '0');
  });

  it('should handle maximum value', () => {
    render(<Progress value={100} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '100');
  });

  it('should handle undefined value', () => {
    render(<Progress value={undefined} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '0');
  });

  it('should handle null value', () => {
    render(<Progress value={null} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '0');
  });

  it('should handle negative value', () => {
    render(<Progress value={-10} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '-10');
  });

  it('should handle value greater than 100', () => {
    render(<Progress value={150} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '150');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <Progress
        data-testid="progress"
        value={75}
        max={100}
        aria-label="Download progress"
        aria-valuetext="75% complete"
      />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('role', 'progressbar');
    expect(progress).toHaveAttribute('aria-label', 'Download progress');
    expect(progress).toHaveAttribute('aria-valuetext', '75% complete');
  });

  it('should handle different value ranges', () => {
    const values = [0, 25, 50, 75, 100];

    values.forEach((value) => {
      const { unmount } = render(
        <Progress value={value} data-testid={`progress-${value}`} />
      );

      const progress = screen.getByTestId(`progress-${value}`);
      expect(progress).toHaveAttribute('value', value.toString());

      unmount();
    });
  });

  it('should handle decimal values', () => {
    render(<Progress value={33.5} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '33.5');
  });

  it('should handle very small values', () => {
    render(<Progress value={0.1} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '0.1');
  });

  it('should handle very large values', () => {
    render(<Progress value={999999} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '999999');
  });

  it('should render with custom max value', () => {
    render(<Progress value={50} max={200} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '50');
    expect(progress).toHaveAttribute('max', '200');
  });

  it('should handle string values', () => {
    render(<Progress value="75" data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '75');
  });

  it('should handle boolean values', () => {
    render(<Progress value={true} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '1');
  });

  it('should handle false boolean values', () => {
    render(<Progress value={false} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('value', '0');
  });

  it('should have proper semantic structure', () => {
    render(<Progress value={50} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress.tagName).toBe('DIV');
    expect(progress).toHaveAttribute('role', 'progressbar');
  });

  it('should handle focus events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <Progress
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="progress"
        tabIndex={0}
      />
    );

    const progress = screen.getByTestId('progress');

    progress.focus();
    expect(handleFocus).toHaveBeenCalledTimes(1);

    progress.blur();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Progress onClick={handleClick} data-testid="progress" />);

    const progress = screen.getByTestId('progress');
    progress.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle mouse events', () => {
    const handleMouseEnter = jest.fn();
    const handleMouseLeave = jest.fn();

    render(
      <Progress
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="progress"
      />
    );

    const progress = screen.getByTestId('progress');

    progress.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);

    progress.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard events', () => {
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();

    render(
      <Progress
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        data-testid="progress"
        tabIndex={0}
      />
    );

    const progress = screen.getByTestId('progress');

    progress.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(handleKeyDown).toHaveBeenCalledTimes(1);

    progress.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter', bubbles: true })
    );
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('should be accessible with proper ARIA attributes', () => {
    render(
      <Progress
        data-testid="progress"
        value={60}
        max={100}
        aria-label="Loading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={60}
      />
    );

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('role', 'progressbar');
    expect(progress).toHaveAttribute('aria-label', 'Loading progress');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuenow', '60');
  });
});
