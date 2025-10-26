import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

describe('Select', () => {
  it('should render select trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Select an option');
  });

  it('should render select items', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" data-testid="select-item-1">Option 1</SelectItem>
          <SelectItem value="option2" data-testid="select-item-2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    const item1 = screen.getByTestId('select-item-1');
    const item2 = screen.getByTestId('select-item-2');
    
    expect(item1).toBeInTheDocument();
    expect(item2).toBeInTheDocument();
    expect(item1).toHaveTextContent('Option 1');
    expect(item2).toHaveTextContent('Option 2');
  });

  it('should render select with groups', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel data-testid="group-label">Group 1</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectGroup>
          <SelectSeparator data-testid="separator" />
          <SelectGroup>
            <SelectLabel>Group 2</SelectLabel>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    const groupLabel = screen.getByTestId('group-label');
    const separator = screen.getByTestId('separator');
    
    expect(groupLabel).toBeInTheDocument();
    expect(groupLabel).toHaveTextContent('Group 1');
    expect(separator).toBeInTheDocument();
  });

  it('should render scroll buttons', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton data-testid="scroll-up" />
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectScrollDownButton data-testid="scroll-down" />
        </SelectContent>
      </Select>
    );

    const scrollUp = screen.getByTestId('scroll-up');
    const scrollDown = screen.getByTestId('scroll-down');
    
    expect(scrollUp).toBeInTheDocument();
    expect(scrollDown).toBeInTheDocument();
  });

  it('should apply custom className to trigger', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger-class" data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toHaveClass('custom-trigger-class');
  });

  it('should apply custom className to content', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="custom-content-class" data-testid="select-content">
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const content = screen.getByTestId('select-content');
    expect(content).toHaveClass('custom-content-class');
  });

  it('should apply custom className to item', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" className="custom-item-class" data-testid="select-item">
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const item = screen.getByTestId('select-item');
    expect(item).toHaveClass('custom-item-class');
  });

  it('should have correct base classes for trigger', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toHaveClass(
      'flex',
      'h-10',
      'w-full',
      'items-center',
      'justify-between',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-sm'
    );
  });

  it('should have correct base classes for content', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent data-testid="select-content">
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const content = screen.getByTestId('select-content');
    expect(content).toHaveClass(
      'relative',
      'z-50',
      'max-h-96',
      'min-w-[8rem]',
      'overflow-hidden',
      'rounded-md',
      'border',
      'bg-popover',
      'text-popover-foreground',
      'shadow-md'
    );
  });

  it('should have correct base classes for item', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" data-testid="select-item">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const item = screen.getByTestId('select-item');
    expect(item).toHaveClass(
      'relative',
      'flex',
      'w-full',
      'cursor-default',
      'select-none',
      'items-center',
      'rounded-sm',
      'py-1.5',
      'pl-8',
      'pr-2',
      'text-sm',
      'outline-none'
    );
  });

  it('should forward ref to trigger', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Select>
        <SelectTrigger ref={ref} data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(ref.current).toBeInTheDocument();
  });

  it('should forward ref to content', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent ref={ref} data-testid="select-content">
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(ref.current).toBeInTheDocument();
  });

  it('should forward ref to item', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem ref={ref} value="option1" data-testid="select-item">
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>
    );

    expect(ref.current).toBeInTheDocument();
  });

  it('should pass through HTML attributes to trigger', () => {
    render(
      <Select>
        <SelectTrigger
          data-testid="select-trigger"
          id="test-trigger"
          title="Select trigger"
          aria-label="Choose an option"
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toHaveAttribute('id', 'test-trigger');
    expect(trigger).toHaveAttribute('title', 'Select trigger');
    expect(trigger).toHaveAttribute('aria-label', 'Choose an option');
  });

  it('should pass through HTML attributes to item', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="option1"
            data-testid="select-item"
            title="Option 1"
            aria-label="First option"
          >
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const item = screen.getByTestId('select-item');
    expect(item).toHaveAttribute('title', 'Option 1');
    expect(item).toHaveAttribute('aria-label', 'First option');
  });

  it('should handle disabled state', () => {
    render(
      <Select disabled>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toBeDisabled();
  });

  it('should handle disabled item', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" disabled data-testid="select-item">
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const item = screen.getByTestId('select-item');
    expect(item).toHaveAttribute('data-disabled', 'true');
  });

  it('should handle required state', () => {
    render(
      <Select required>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toBeRequired();
  });

  it('should handle multiple items', () => {
    const items = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
    
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {items.map((item, index) => (
            <SelectItem key={index} value={`option${index + 1}`}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

    items.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should handle empty content', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent data-testid="select-content">
          {/* Empty content */}
        </SelectContent>
      </Select>
    );

    const content = screen.getByTestId('select-content');
    expect(content).toBeInTheDocument();
  });

  it('should handle complex children in items', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" data-testid="select-item">
            <span className="mr-2">🔒</span>
            <span>Secure Option</span>
            <span className="ml-2 text-xs text-gray-500">Premium</span>
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const item = screen.getByTestId('select-item');
    expect(item).toHaveTextContent('🔒');
    expect(item).toHaveTextContent('Secure Option');
    expect(item).toHaveTextContent('Premium');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <Select>
        <SelectTrigger
          data-testid="select-trigger"
          aria-label="Choose an option"
          aria-describedby="select-help"
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toHaveAttribute('aria-label', 'Choose an option');
    expect(trigger).toHaveAttribute('aria-describedby', 'select-help');
  });

  it('should handle keyboard navigation', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1" data-testid="select-item-1">Option 1</SelectItem>
          <SelectItem value="option2" data-testid="select-item-2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    
    // Focus the trigger
    trigger.focus();
    expect(trigger).toHaveFocus();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(
      <Select>
        <SelectTrigger onClick={handleClick} data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    trigger.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
