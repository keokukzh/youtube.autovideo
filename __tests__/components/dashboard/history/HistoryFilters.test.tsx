import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HistoryFilters } from '@/components/dashboard/history/HistoryFilters';

// Mock the useDebounce hook
jest.mock('@/lib/hooks/use-debounce', () => ({
  useDebounce: jest.fn((value) => value),
}));

describe('HistoryFilters', () => {
  const mockOnFiltersChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  const defaultProps = {
    filters: {},
    onFiltersChange: mockOnFiltersChange,
    onClearFilters: mockOnClearFilters,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render filter controls', () => {
    render(<HistoryFilters {...defaultProps} />);

    expect(screen.getByLabelText('Search generations')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Input Type')).toBeInTheDocument();
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /clear filters/i })
    ).toBeInTheDocument();
  });

  it('should handle search input changes', async () => {
    render(<HistoryFilters {...defaultProps} />);

    const searchInput = screen.getByLabelText('Search generations');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'test search',
      });
    });
  });

  it('should handle status filter changes', async () => {
    render(<HistoryFilters {...defaultProps} />);

    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    fireEvent.click(statusSelect);

    const completedOption = screen.getByText('Completed');
    fireEvent.click(completedOption);

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        status: 'completed',
      });
    });
  });

  it('should handle input type filter changes', async () => {
    render(<HistoryFilters {...defaultProps} />);

    const typeSelect = screen.getByRole('combobox', { name: /input type/i });
    fireEvent.click(typeSelect);

    const youtubeOption = screen.getByText('YouTube');
    fireEvent.click(youtubeOption);

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        input_type: 'youtube',
      });
    });
  });

  it('should handle date range filter changes', async () => {
    render(<HistoryFilters {...defaultProps} />);

    const dateSelect = screen.getByRole('combobox', { name: /date range/i });
    fireEvent.click(dateSelect);

    const lastWeekOption = screen.getByText('Last Week');
    fireEvent.click(lastWeekOption);

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        date_range: 'last_week',
      });
    });
  });

  it('should handle multiple filter changes', async () => {
    render(<HistoryFilters {...defaultProps} />);

    // Set search
    const searchInput = screen.getByLabelText('Search generations');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Set status
    const statusSelect = screen.getByRole('combobox', { name: /status/i });
    fireEvent.click(statusSelect);
    fireEvent.click(screen.getByText('Completed'));

    // Set input type
    const typeSelect = screen.getByRole('combobox', { name: /input type/i });
    fireEvent.click(typeSelect);
    fireEvent.click(screen.getByText('YouTube'));

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        search: 'test',
        status: 'completed',
        input_type: 'youtube',
      });
    });
  });

  it('should clear all filters when clear button is clicked', () => {
    render(<HistoryFilters {...defaultProps} />);

    const clearButton = screen.getByRole('button', { name: /clear filters/i });
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  it('should display current filter values', () => {
    const filtersWithValues = {
      search: 'test search',
      status: 'completed',
      input_type: 'youtube',
      date_range: 'last_week',
    };

    render(<HistoryFilters {...defaultProps} filters={filtersWithValues} />);

    expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('Last Week')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<HistoryFilters {...defaultProps} />);

    // Check for proper labels
    expect(screen.getByLabelText('Search generations')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Input Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Date Range')).toBeInTheDocument();

    // Check for proper roles
    expect(
      screen.getByRole('combobox', { name: /status/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /input type/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /date range/i })
    ).toBeInTheDocument();
  });
});
