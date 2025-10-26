import React from 'react';
import { render, screen } from '@testing-library/react';
import { ResponsiveContainer } from '@/components/ui/responsive-container';

describe('ResponsiveContainer', () => {
  it('renders with default props', () => {
    render(
      <div data-testid="container">
        <ResponsiveContainer>
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );

    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(
      'mx-auto',
      'w-full',
      'max-w-7xl',
      'px-4',
      'sm:px-6',
      'lg:px-8'
    );
    expect(container).toHaveTextContent('Test content');
  });

  it('renders with custom className', () => {
    render(
      <div data-testid="container">
        <ResponsiveContainer className="custom-class">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );

    const container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with different maxWidth values', () => {
    const { rerender } = render(
      <div data-testid="container">
        <ResponsiveContainer maxWidth="sm">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );

    let container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('max-w-sm');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer maxWidth="md">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('max-w-md');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer maxWidth="lg">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('max-w-lg');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer maxWidth="xl">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('max-w-xl');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer maxWidth="2xl">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('max-w-2xl');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer maxWidth="4xl">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('max-w-4xl');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer maxWidth="6xl">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('max-w-6xl');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer maxWidth="7xl">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('max-w-7xl');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer maxWidth="full">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('max-w-full');
  });

  it('renders with different padding values', () => {
    const { rerender } = render(
      <div data-testid="container">
        <ResponsiveContainer padding="none">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );

    let container = screen.getByTestId('container');
    expect(container.firstChild).not.toHaveClass(
      'px-2',
      'px-4',
      'px-6',
      'px-8'
    );

    rerender(
      <div data-testid="container">
        <ResponsiveContainer padding="sm">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('px-2', 'sm:px-4');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer padding="md">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('px-4', 'sm:px-6');

    rerender(
      <div data-testid="container">
        <ResponsiveContainer padding="lg">
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );
    container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
  });

  it('renders with multiple children', () => {
    render(
      <div data-testid="container">
        <ResponsiveContainer>
          <div>Child 1</div>
          <div>Child 2</div>
          <span>Child 3</span>
        </ResponsiveContainer>
      </div>
    );

    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Child 1');
    expect(container).toHaveTextContent('Child 2');
    expect(container).toHaveTextContent('Child 3');
  });

  it('combines custom className with default classes', () => {
    render(
      <div data-testid="container">
        <ResponsiveContainer
          className="custom-class"
          maxWidth="lg"
          padding="sm"
        >
          <div>Test content</div>
        </ResponsiveContainer>
      </div>
    );

    const container = screen.getByTestId('container');
    expect(container.firstChild).toHaveClass(
      'mx-auto',
      'w-full',
      'max-w-lg',
      'px-2',
      'sm:px-4',
      'custom-class'
    );
  });

  it('renders with complex children structure', () => {
    render(
      <div data-testid="container">
        <ResponsiveContainer>
          <header>
            <h1>Title</h1>
          </header>
          <main>
            <section>
              <p>Content paragraph</p>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </section>
          </main>
          <footer>
            <p>Footer content</p>
          </footer>
        </ResponsiveContainer>
      </div>
    );

    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Title');
    expect(container).toHaveTextContent('Content paragraph');
    expect(container).toHaveTextContent('Item 1');
    expect(container).toHaveTextContent('Item 2');
    expect(container).toHaveTextContent('Footer content');
  });
});
