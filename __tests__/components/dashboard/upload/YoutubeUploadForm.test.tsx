import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { YoutubeUploadForm } from '@/components/dashboard/upload/YoutubeUploadForm';

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  isValidYouTubeUrl: jest.fn(),
}));

const mockIsValidYouTubeUrl = require('@/lib/utils').isValidYouTubeUrl;

describe('YoutubeUploadForm', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    isGenerating: false,
    error: null,
    progress: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsValidYouTubeUrl.mockReturnValue(true);
  });

  it('should render form with input and submit button', () => {
    render(<YoutubeUploadForm {...mockProps} />);

    expect(screen.getByLabelText('YouTube Video URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://www.youtube.com/watch?v=...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate content/i })).toBeInTheDocument();
  });

  it('should show error when provided', () => {
    const error = 'Test error message';
    render(<YoutubeUploadForm {...mockProps} error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('should show progress when provided', () => {
    const progress = {
      message: 'Processing video...',
      step: 2,
      total: 4,
      percentage: 50,
    };
    render(<YoutubeUploadForm {...mockProps} progress={progress} />);

    expect(screen.getByText(progress.message)).toBeInTheDocument();
    expect(screen.getByText(`${progress.step}/${progress.total}`)).toBeInTheDocument();
    expect(screen.getByText(`${progress.percentage}% complete`)).toBeInTheDocument();
  });

  it('should disable form when generating', () => {
    render(<YoutubeUploadForm {...mockProps} isGenerating={true} />);

    const input = screen.getByLabelText('YouTube Video URL');
    const button = screen.getByRole('button', { name: /processing video/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(screen.getByText('Processing Video...')).toBeInTheDocument();
  });

  it('should validate YouTube URL on submit', async () => {
    mockIsValidYouTubeUrl.mockReturnValue(false);
    
    render(<YoutubeUploadForm {...mockProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    const button = screen.getByRole('button', { name: /generate content/i });

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid YouTube URL')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with valid URL', async () => {
    mockIsValidYouTubeUrl.mockReturnValue(true);
    
    render(<YoutubeUploadForm {...mockProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    const button = screen.getByRole('button', { name: /generate content/i });

    fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        url: 'https://youtube.com/watch?v=test'
      });
    });
  });

  it('should show loading state when generating', () => {
    render(<YoutubeUploadForm {...mockProps} isGenerating={true} />);

    expect(screen.getByText('Processing Video...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should have proper accessibility attributes', () => {
    render(<YoutubeUploadForm {...mockProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    expect(input).toHaveAttribute('type', 'url');
    expect(input).toHaveAttribute('aria-describedby', 'youtube-url-error youtube-url-help');
    
    const helpText = screen.getByText(/paste any youtube video url/i);
    expect(helpText).toHaveAttribute('id', 'youtube-url-help');
  });

  it('should show validation error with proper styling', async () => {
    mockIsValidYouTubeUrl.mockReturnValue(false);
    
    render(<YoutubeUploadForm {...mockProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    const button = screen.getByRole('button', { name: /generate content/i });

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(button);

    await waitFor(() => {
      const errorMessage = screen.getByText('Please enter a valid YouTube URL');
      expect(errorMessage).toHaveClass('text-red-600');
      expect(errorMessage).toHaveAttribute('id', 'youtube-url-error');
    });
  });

  it('should clear validation error when valid URL is entered', async () => {
    mockIsValidYouTubeUrl
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    
    render(<YoutubeUploadForm {...mockProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    const button = screen.getByRole('button', { name: /generate content/i });

    // First submit with invalid URL
    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid YouTube URL')).toBeInTheDocument();
    });

    // Then enter valid URL
    fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=test' } });

    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid YouTube URL')).not.toBeInTheDocument();
    });
  });

  it('should handle form submission with keyboard', async () => {
    mockIsValidYouTubeUrl.mockReturnValue(true);
    
    render(<YoutubeUploadForm {...mockProps} />);

    const input = screen.getByLabelText('YouTube Video URL');

    fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        url: 'https://youtube.com/watch?v=test'
      });
    });
  });

  it('should show progress bar with correct value', () => {
    const progress = {
      message: 'Processing video...',
      step: 3,
      total: 4,
      percentage: 75,
    };
    render(<YoutubeUploadForm {...mockProps} progress={progress} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should have YouTube icon in input', () => {
    render(<YoutubeUploadForm {...mockProps} />);

    const input = screen.getByLabelText('YouTube Video URL');
    const parent = input.closest('.relative');
    expect(parent).toBeInTheDocument();
  });

  it('should have proper button styling and gradient', () => {
    render(<YoutubeUploadForm {...mockProps} />);

    const button = screen.getByRole('button', { name: /generate content/i });
    expect(button).toHaveClass('gradient-primary');
  });

  it('should handle empty form submission', async () => {
    mockIsValidYouTubeUrl.mockReturnValue(false);
    
    render(<YoutubeUploadForm {...mockProps} />);

    const button = screen.getByRole('button', { name: /generate content/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid YouTube URL')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should maintain form state during generation', () => {
    render(<YoutubeUploadForm {...mockProps} isGenerating={true} />);

    const input = screen.getByLabelText('YouTube Video URL');
    fireEvent.change(input, { target: { value: 'https://youtube.com/watch?v=test' } });

    // Value should be maintained even when generating
    expect(input).toHaveValue('https://youtube.com/watch?v=test');
  });
});
