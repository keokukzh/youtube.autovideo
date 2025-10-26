import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('should render with default props', () => {
    render(<Label data-testid="label">Test Label</Label>);

    const label = screen.getByTestId('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Test Label');
  });

  it('should render with htmlFor attribute', () => {
    render(
      <Label htmlFor="test-input" data-testid="label">
        Test Label
      </Label>
    );

    const label = screen.getByTestId('label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('should apply custom className', () => {
    render(
      <Label className="custom-label-class" data-testid="label">
        Test Label
      </Label>
    );

    const label = screen.getByTestId('label');
    expect(label).toHaveClass('custom-label-class');
  });

  it('should have correct base classes', () => {
    render(<Label data-testid="label">Test Label</Label>);

    const label = screen.getByTestId('label');
    expect(label).toHaveClass(
      'text-sm',
      'font-medium',
      'leading-none',
      'peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-70'
    );
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(
      <Label ref={ref} data-testid="label">
        Test Label
      </Label>
    );

    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveTextContent('Test Label');
  });

  it('should pass through HTML attributes', () => {
    render(
      <Label
        data-testid="label"
        id="test-label"
        title="Label title"
        aria-describedby="label-help"
      >
        Test Label
      </Label>
    );

    const label = screen.getByTestId('label');
    expect(label).toHaveAttribute('id', 'test-label');
    expect(label).toHaveAttribute('title', 'Label title');
    expect(label).toHaveAttribute('aria-describedby', 'label-help');
  });

  it('should render with children content', () => {
    render(
      <Label data-testid="label">
        <span data-testid="label-content">Label Content</span>
      </Label>
    );

    const label = screen.getByTestId('label');
    const content = screen.getByTestId('label-content');

    expect(label).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Label Content');
  });

  it('should handle complex children', () => {
    render(
      <Label data-testid="label">
        <span className="mr-1">🔒</span>
        <span>Password</span>
        <span className="ml-1 text-red-500">*</span>
      </Label>
    );

    const label = screen.getByTestId('label');
    expect(label).toHaveTextContent('🔒');
    expect(label).toHaveTextContent('Password');
    expect(label).toHaveTextContent('*');
  });

  it('should handle empty content', () => {
    render(<Label data-testid="label" />);

    const label = screen.getByTestId('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('');
  });

  it('should handle numeric content', () => {
    render(<Label data-testid="label">{42}</Label>);

    const label = screen.getByTestId('label');
    expect(label).toHaveTextContent('42');
  });

  it('should handle boolean content', () => {
    render(<Label data-testid="label">{String(true)}</Label>);

    const label = screen.getByTestId('label');
    expect(label).toHaveTextContent('true');
  });

  it('should handle null content', () => {
    render(<Label data-testid="label">{null}</Label>);

    const label = screen.getByTestId('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('');
  });

  it('should handle undefined content', () => {
    render(<Label data-testid="label">{undefined}</Label>);

    const label = screen.getByTestId('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('');
  });

  it('should have proper semantic structure', () => {
    render(<Label data-testid="label">Semantic Label</Label>);

    const label = screen.getByTestId('label');
    expect(label.tagName).toBe('LABEL');
  });

  it('should work with form elements', () => {
    render(
      <div>
        <Label htmlFor="test-input" data-testid="label">
          Test Input
        </Label>
        <input id="test-input" data-testid="input" />
      </div>
    );

    const label = screen.getByTestId('label');
    const input = screen.getByTestId('input');

    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(
      <Label onClick={handleClick} data-testid="label">
        Clickable Label
      </Label>
    );

    const label = screen.getByTestId('label');
    label.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle focus events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <Label onFocus={handleFocus} onBlur={handleBlur} data-testid="label">
        Focusable Label
      </Label>
    );

    const label = screen.getByTestId('label');

    label.focus();
    expect(handleFocus).toHaveBeenCalledTimes(1);

    label.blur();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle mouse events', () => {
    const handleMouseEnter = jest.fn();
    const handleMouseLeave = jest.fn();

    render(
      <Label
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid="label"
      >
        Hoverable Label
      </Label>
    );

    const label = screen.getByTestId('label');

    label.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);

    label.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard events', () => {
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();

    render(
      <Label
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        data-testid="label"
        tabIndex={0}
      >
        Keyboard Label
      </Label>
    );

    const label = screen.getByTestId('label');

    label.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(handleKeyDown).toHaveBeenCalledTimes(1);

    label.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter', bubbles: true })
    );
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', () => {
    render(
      <Label
        data-testid="label"
        htmlFor="test-input"
        aria-describedby="label-help"
      >
        Accessible Label
      </Label>
    );

    const label = screen.getByTestId('label');
    expect(label).toHaveAttribute('for', 'test-input');
    expect(label).toHaveAttribute('aria-describedby', 'label-help');
  });

  it('should handle disabled state styling', () => {
    render(
      <div>
        <Label data-testid="label">Normal Label</Label>
        <input disabled />
      </div>
    );

    const label = screen.getByTestId('label');
    expect(label).toHaveClass(
      'peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-70'
    );
  });
});
