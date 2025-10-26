import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('should render with default props', () => {
    render(<Input data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
  });

  it('should render with custom type', () => {
    render(<Input type="email" data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter your name" data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  it('should render with value', () => {
    render(
      <Input value="test value" onChange={() => {}} data-testid="input" />
    );

    const input = screen.getByTestId('input');
    expect(input).toHaveValue('test value');
  });

  it('should handle onChange events', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} data-testid="input" />);

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('new value');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
  });

  it('should be enabled when disabled prop is false', () => {
    render(<Input disabled={false} data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).not.toBeDisabled();
  });

  it('should be required when required prop is true', () => {
    render(<Input required data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toBeRequired();
  });

  it('should have correct name attribute', () => {
    render(<Input name="username" data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('should have correct id attribute', () => {
    render(<Input id="user-input" data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('id', 'user-input');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input-class" data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-input-class');
  });

  it('should have correct base classes', () => {
    render(<Input data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveClass(
      'flex',
      'h-10',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-base'
    );
  });

  it('should have focus styles', () => {
    render(<Input data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    );
  });

  it('should have disabled styles', () => {
    render(<Input disabled data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveClass(
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    );
  });

  it('should have file input styles', () => {
    render(<Input type="file" data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveClass(
      'file:border-0',
      'file:bg-transparent',
      'file:text-sm',
      'file:font-medium',
      'file:text-foreground'
    );
  });

  it('should have placeholder styles', () => {
    render(<Input placeholder="Test placeholder" data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveClass('placeholder:text-muted-foreground');
  });

  it('should have responsive text size', () => {
    render(<Input data-testid="input" />);

    const input = screen.getByTestId('input');
    expect(input).toHaveClass('text-base', 'md:text-sm');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} data-testid="input" />);

    expect(ref.current).toBeInTheDocument();
  });

  it('should pass through all HTML input attributes', () => {
    render(
      <Input
        data-testid="input"
        autoComplete="email"
        autoFocus
        maxLength={100}
        minLength={5}
        pattern="[a-z]+"
        readOnly
        size={20}
        step="0.1"
        tabIndex={1}
        title="Input title"
      />
    );

    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toHaveAttribute('autofocus', '');
    expect(input).toHaveAttribute('maxlength', '100');
    expect(input).toHaveAttribute('minlength', '5');
    expect(input).toHaveAttribute('pattern', '[a-z]+');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('size', '20');
    expect(input).toHaveAttribute('step', '0.1');
    expect(input).toHaveAttribute('tabindex', '1');
    expect(input).toHaveAttribute('title', 'Input title');
  });

  it('should handle different input types', () => {
    const types = [
      'text',
      'email',
      'password',
      'number',
      'tel',
      'url',
      'search',
      'date',
      'time',
      'datetime-local',
    ];

    types.forEach((type) => {
      const { unmount } = render(
        <Input type={type as any} data-testid={`input-${type}`} />
      );

      const input = screen.getByTestId(`input-${type}`);
      expect(input).toHaveAttribute('type', type);

      unmount();
    });
  });

  it('should handle controlled input', () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState('initial');
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="input"
        />
      );
    };

    render(<TestComponent />);

    const input = screen.getByTestId('input');
    expect(input).toHaveValue('initial');

    fireEvent.change(input, { target: { value: 'updated' } });
    expect(input).toHaveValue('updated');
  });

  it('should handle uncontrolled input', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} data-testid="input" />);

    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'uncontrolled' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('uncontrolled');
  });

  it('should handle onFocus and onBlur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <Input onFocus={handleFocus} onBlur={handleBlur} data-testid="input" />
    );

    const input = screen.getByTestId('input');

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle onKeyDown events', () => {
    const handleKeyDown = jest.fn();

    render(<Input onKeyDown={handleKeyDown} data-testid="input" />);

    const input = screen.getByTestId('input');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(
      <Input
        data-testid="input"
        aria-label="Username input"
        aria-describedby="username-help"
        aria-invalid="false"
      />
    );

    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-label', 'Username input');
    expect(input).toHaveAttribute('aria-describedby', 'username-help');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should handle form validation attributes', () => {
    render(
      <Input
        data-testid="input"
        required
        minLength={3}
        maxLength={20}
        pattern="[a-zA-Z0-9]+"
      />
    );

    const input = screen.getByTestId('input');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('minlength', '3');
    expect(input).toHaveAttribute('maxlength', '20');
    expect(input).toHaveAttribute('pattern', '[a-zA-Z0-9]+');
  });
});
