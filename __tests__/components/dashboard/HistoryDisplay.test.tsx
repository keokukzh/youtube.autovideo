import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HistoryDisplay } from '@/components/dashboard/HistoryDisplay';
import { mockRouter } from '@/__tests__/utils/test-helpers';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    search: '?page=1&status=completed',
  },
  writable: true,
});

describe('HistoryDisplay', () => {
  const mockGenerations = [
    {
      id: 'gen-1',
      input_type: 'youtube',
      input_url: 'https://youtube.com/watch?v=test1',
      transcript: 'This is a test transcript for generation 1',
      status: 'completed',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'gen-2',
      input_type: 'audio',
      input_url: null,
      transcript: 'This is a test transcript for generation 2',
      status: 'processing',
      created_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 'gen-3',
      input_type: 'text',
      input_url: null,
      transcript: 'This is a test transcript for generation 3',
      status: 'failed',
      created_at: '2024-01-03T00:00:00Z',
    },
  ];

  const mockPagination = {
    total: 3,
    limit: 10,
    has_prev: false,
    has_next: false,
  };

  const defaultProps = {
    generations: mockGenerations,
    pagination: mockPagination,
    currentPage: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no generations', () => {
    render(<HistoryDisplay {...defaultProps} generations={[]} />);

    expect(screen.getByText('No generations yet')).toBeInTheDocument();
    expect(screen.getByText('Start creating content to see your generation history here.')).toBeInTheDocument();
    expect(screen.getByText('Create Your First Generation')).toBeInTheDocument();
  });

  it('should render generations list with correct data', () => {
    render(<HistoryDisplay {...defaultProps} />);

    expect(screen.getByText('gen-1')).toBeInTheDocument();
    expect(screen.getByText('gen-2')).toBeInTheDocument();
    expect(screen.getByText('gen-3')).toBeInTheDocument();
  });

  it('should show correct status badges', () => {
    render(<HistoryDisplay {...defaultProps} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('should show correct input type icons and labels', () => {
    render(<HistoryDisplay {...defaultProps} />);

    expect(screen.getByText('youtube')).toBeInTheDocument();
    expect(screen.getByText('audio')).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('should filter generations by search term', async () => {
    render(<HistoryDisplay {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search generations...');
    fireEvent.change(searchInput, { target: { value: 'test1' } });

    await waitFor(() => {
      expect(screen.getByText('gen-1')).toBeInTheDocument();
      expect(screen.queryByText('gen-2')).not.toBeInTheDocument();
      expect(screen.queryByText('gen-3')).not.toBeInTheDocument();
    });
  });

  it('should filter generations by status', async () => {
    render(<HistoryDisplay {...defaultProps} />);

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    fireEvent.click(statusSelect);

    const completedOption = screen.getByText('Completed');
    fireEvent.click(completedOption);

    await waitFor(() => {
      expect(screen.getByText('gen-1')).toBeInTheDocument();
      expect(screen.queryByText('gen-2')).not.toBeInTheDocument();
      expect(screen.queryByText('gen-3')).not.toBeInTheDocument();
    });
  });

  it('should filter generations by input type', async () => {
    render(<HistoryDisplay {...defaultProps} />);

    const typeSelect = screen.getByRole('combobox', { name: /input type/i });
    fireEvent.click(typeSelect);

    const youtubeOption = screen.getByText('YouTube');
    fireEvent.click(youtubeOption);

    await waitFor(() => {
      expect(screen.getByText('gen-1')).toBeInTheDocument();
      expect(screen.queryByText('gen-2')).not.toBeInTheDocument();
      expect(screen.queryByText('gen-3')).not.toBeInTheDocument();
    });
  });

  it('should clear all filters when clear button is clicked', async () => {
    render(<HistoryDisplay {...defaultProps} />);

    // Apply some filters first
    const searchInput = screen.getByPlaceholderText('Search generations...');
    fireEvent.change(searchInput, { target: { value: 'test1' } });

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    fireEvent.click(statusSelect);
    fireEvent.click(screen.getByText('Completed'));

    // Clear filters
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
      expect(screen.getByText('gen-1')).toBeInTheDocument();
      expect(screen.getByText('gen-2')).toBeInTheDocument();
      expect(screen.getByText('gen-3')).toBeInTheDocument();
    });
  });

  it('should navigate to generation detail when view button is clicked', () => {
    render(<HistoryDisplay {...defaultProps} />);

    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/generation/gen-1');
  });

  it('should show pagination when there are more pages', () => {
    const paginationWithNext = {
      ...mockPagination,
      total: 25,
      has_next: true,
    };

    render(<HistoryDisplay {...defaultProps} pagination={paginationWithNext} />);

    expect(screen.getByText('Showing 1 to 10 of 25 generations')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should handle page navigation', async () => {
    const paginationWithNext = {
      ...mockPagination,
      total: 25,
      has_next: true,
    };

    render(<HistoryDisplay {...defaultProps} pagination={paginationWithNext} currentPage={2} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/history?page=3');
    });
  });

  it('should disable previous button on first page', () => {
    const paginationWithNext = {
      ...mockPagination,
      total: 25,
      has_next: true,
    };

    render(<HistoryDisplay {...defaultProps} pagination={paginationWithNext} currentPage={1} />);

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    const paginationWithPrev = {
      ...mockPagination,
      total: 25,
      has_prev: true,
    };

    render(<HistoryDisplay {...defaultProps} pagination={paginationWithPrev} currentPage={3} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('should show transcript preview when available', () => {
    render(<HistoryDisplay {...defaultProps} />);

    expect(screen.getByText('This is a test transcript for generation 1')).toBeInTheDocument();
    expect(screen.getByText('This is a test transcript for generation 2')).toBeInTheDocument();
    expect(screen.getByText('This is a test transcript for generation 3')).toBeInTheDocument();
  });

  it('should show "Text Input" for text generations without URL', () => {
    render(<HistoryDisplay {...defaultProps} />);

    const textInputLabels = screen.getAllByText('Text Input');
    expect(textInputLabels).toHaveLength(2); // gen-2 and gen-3 are text/audio without URL
  });

  it('should show truncated URL for YouTube generations', () => {
    render(<HistoryDisplay {...defaultProps} />);

    expect(screen.getByText('https://youtube.com/watch?v=test1')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<HistoryDisplay {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search generations...');
    expect(searchInput).toHaveAttribute('type', 'text');

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    expect(statusSelect).toBeInTheDocument();

    const typeSelect = screen.getByRole('combobox', { name: /input type/i });
    expect(typeSelect).toBeInTheDocument();
  });

  it('should show correct status badge colors', () => {
    render(<HistoryDisplay {...defaultProps} />);

    const completedBadge = screen.getByText('Completed');
    const processingBadge = screen.getByText('Processing');
    const failedBadge = screen.getByText('Failed');

    expect(completedBadge).toHaveClass('bg-green-100', 'text-green-800');
    expect(processingBadge).toHaveClass('bg-blue-100', 'text-blue-800');
    expect(failedBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should handle empty search results', async () => {
    render(<HistoryDisplay {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search generations...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.queryByText('gen-1')).not.toBeInTheDocument();
      expect(screen.queryByText('gen-2')).not.toBeInTheDocument();
      expect(screen.queryByText('gen-3')).not.toBeInTheDocument();
    });
  });

  it('should handle case-insensitive search', async () => {
    render(<HistoryDisplay {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('Search generations...');
    fireEvent.change(searchInput, { target: { value: 'TEST1' } });

    await waitFor(() => {
      expect(screen.getByText('gen-1')).toBeInTheDocument();
      expect(screen.queryByText('gen-2')).not.toBeInTheDocument();
      expect(screen.queryByText('gen-3')).not.toBeInTheDocument();
    });
  });

  it('should show correct date formatting', () => {
    render(<HistoryDisplay {...defaultProps} />);

    // The formatDate function should be called and display formatted dates
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 2, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 3, 2024')).toBeInTheDocument();
  });

  it('should show correct relative time formatting', () => {
    render(<HistoryDisplay {...defaultProps} />);

    // The formatRelativeTime function should be called and display relative times
    expect(screen.getByText('3 days ago')).toBeInTheDocument();
    expect(screen.getByText('2 days ago')).toBeInTheDocument();
    expect(screen.getByText('1 day ago')).toBeInTheDocument();
  });

  it('should handle filter changes with URL updates', async () => {
    render(<HistoryDisplay {...defaultProps} />);

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    fireEvent.click(statusSelect);
    fireEvent.click(screen.getByText('Completed'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/history?status=completed');
    });
  });

  it('should reset page when filters change', async () => {
    render(<HistoryDisplay {...defaultProps} />);

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    fireEvent.click(statusSelect);
    fireEvent.click(screen.getByText('Completed'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/history?status=completed');
    });
  });

  it('should show correct pagination info for different page sizes', () => {
    const paginationWithLimit = {
      ...mockPagination,
      total: 25,
      limit: 5,
      has_next: true,
    };

    render(<HistoryDisplay {...defaultProps} pagination={paginationWithLimit} currentPage={2} />);

    expect(screen.getByText('Showing 6 to 10 of 25 generations')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });
});
