import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TextUploadForm } from '@/components/dashboard/upload/TextUploadForm';

describe('TextUploadForm', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    isGenerating: false,
    error: null,
    progress: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with textarea and submit button', () => {
    render(<TextUploadForm {...mockProps} />);

    expect(screen.getByLabelText('Text Content')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/paste your text content here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate content/i })).toBeInTheDocument();
  });

  it('should show error when provided', () => {
    const error = 'Test error message';
    render(<TextUploadForm {...mockProps} error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('should show progress when provided', () => {
    const progress = {
      message: 'Processing text...',
      step: 2,
      total: 4,
      percentage: 50,
    };
    render(<TextUploadForm {...mockProps} progress={progress} />);

    expect(screen.getByText(progress.message)).toBeInTheDocument();
    expect(screen.getByText(`${progress.step}/${progress.total}`)).toBeInTheDocument();
    expect(screen.getByText(`${progress.percentage}% complete`)).toBeInTheDocument();
  });

  it('should disable form when generating', () => {
    render(<TextUploadForm {...mockProps} isGenerating={true} />);

    const textarea = screen.getByLabelText('Text Content');
    const button = screen.getByRole('button', { name: /processing text/i });

    expect(textarea).toBeDisabled();
    expect(button).toBeDisabled();
    expect(screen.getByText('Processing Text...')).toBeInTheDocument();
  });

  it('should validate minimum text length', async () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    const button = screen.getByRole('button', { name: /generate content/i });

    // Enter text less than 100 characters
    fireEvent.change(textarea, { target: { value: 'Short text' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Text must be at least 100 characters')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with valid text', async () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    const button = screen.getByRole('button', { name: /generate content/i });

    const longText = 'This is a long text that exceeds the minimum character requirement for the text upload form. It should be at least 100 characters long to pass validation.';
    
    fireEvent.change(textarea, { target: { value: longText } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        text: longText
      });
    });
  });

  it('should show character count', () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    fireEvent.change(textarea, { target: { value: 'Test text' } });

    expect(screen.getByText('9 characters')).toBeInTheDocument();
  });

  it('should show remaining characters needed when under minimum', () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    fireEvent.change(textarea, { target: { value: 'Short text' } });

    expect(screen.getByText('91 more needed')).toBeInTheDocument();
  });

  it('should show green indicator when text is valid', () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    const longText = 'This is a long text that exceeds the minimum character requirement for the text upload form. It should be at least 100 characters long to pass validation.';
    
    fireEvent.change(textarea, { target: { value: longText } });

    const indicator = screen.getByRole('img', { hidden: true });
    expect(indicator).toHaveClass('bg-green-500');
  });

  it('should show gray indicator when text is invalid', () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    fireEvent.change(textarea, { target: { value: 'Short text' } });

    const indicator = screen.getByRole('img', { hidden: true });
    expect(indicator).toHaveClass('bg-gray-300');
  });

  it('should disable submit button when text is invalid', () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    const button = screen.getByRole('button', { name: /generate content/i });

    fireEvent.change(textarea, { target: { value: 'Short text' } });

    expect(button).toBeDisabled();
  });

  it('should enable submit button when text is valid', () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    const button = screen.getByRole('button', { name: /generate content/i });

    const longText = 'This is a long text that exceeds the minimum character requirement for the text upload form. It should be at least 100 characters long to pass validation.';
    
    fireEvent.change(textarea, { target: { value: longText } });

    expect(button).not.toBeDisabled();
  });

  it('should show loading state when generating', () => {
    render(<TextUploadForm {...mockProps} isGenerating={true} />);

    expect(screen.getByText('Processing Text...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should have proper accessibility attributes', () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    const button = screen.getByRole('button', { name: /generate content/i });

    expect(textarea).toHaveAttribute('aria-describedby', 'text-input-error text-input-help');
    expect(button).toHaveAttribute('aria-label', 'Generate content from text');
  });

  it('should show help text for textarea', () => {
    render(<TextUploadForm {...mockProps} />);

    const helpText = screen.getByText(/paste any text content like blog posts/i);
    expect(helpText).toHaveAttribute('id', 'text-input-help');
  });

  it('should show validation error with proper styling', async () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    const button = screen.getByRole('button', { name: /generate content/i });

    fireEvent.change(textarea, { target: { value: 'Short text' } });
    fireEvent.click(button);

    await waitFor(() => {
      const errorMessage = screen.getByText('Text must be at least 100 characters');
      expect(errorMessage).toHaveClass('text-red-600');
      expect(errorMessage).toHaveAttribute('id', 'text-input-error');
    });
  });

  it('should clear validation error when valid text is entered', async () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    const button = screen.getByRole('button', { name: /generate content/i });

    // First submit with invalid text
    fireEvent.change(textarea, { target: { value: 'Short text' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Text must be at least 100 characters')).toBeInTheDocument();
    });

    // Then enter valid text
    const longText = 'This is a long text that exceeds the minimum character requirement for the text upload form. It should be at least 100 characters long to pass validation.';
    fireEvent.change(textarea, { target: { value: longText } });

    await waitFor(() => {
      expect(screen.queryByText('Text must be at least 100 characters')).not.toBeInTheDocument();
    });
  });

  it('should handle form submission with keyboard', async () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    const longText = 'This is a long text that exceeds the minimum character requirement for the text upload form. It should be at least 100 characters long to pass validation.';

    fireEvent.change(textarea, { target: { value: longText } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', ctrlKey: true });

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        text: longText
      });
    });
  });

  it('should show progress bar with correct value', () => {
    const progress = {
      message: 'Processing text...',
      step: 3,
      total: 4,
      percentage: 75,
    };
    render(<TextUploadForm {...mockProps} progress={progress} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should have proper textarea styling', () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    expect(textarea).toHaveClass('min-h-[200px]', 'resize-none', 'rounded-lg');
  });

  it('should have proper button styling and gradient', () => {
    const longText = 'This is a long text that exceeds the minimum character requirement for the text upload form. It should be at least 100 characters long to pass validation.';
    
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    fireEvent.change(textarea, { target: { value: longText } });

    const button = screen.getByRole('button', { name: /generate content/i });
    expect(button).toHaveClass('gradient-primary');
  });

  it('should show error alert with proper styling', () => {
    const error = 'Text processing error';
    render(<TextUploadForm {...mockProps} error={error} />);

    const alert = screen.getByText(error).closest('[role="alert"]');
    expect(alert).toHaveClass('border-red-200', 'bg-red-50');
  });

  it('should show progress container with proper styling', () => {
    const progress = {
      message: 'Processing text...',
      step: 2,
      total: 4,
      percentage: 50,
    };
    render(<TextUploadForm {...mockProps} progress={progress} />);

    const progressContainer = screen.getByText(progress.message).closest('div');
    expect(progressContainer).toHaveClass('border-indigo-200', 'bg-gradient-to-r', 'from-indigo-50', 'to-purple-50');
  });

  it('should handle empty form submission', async () => {
    render(<TextUploadForm {...mockProps} />);

    const button = screen.getByRole('button', { name: /generate content/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Text must be at least 100 characters')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should maintain form state during generation', () => {
    render(<TextUploadForm {...mockProps} isGenerating={true} />);

    const textarea = screen.getByLabelText('Text Content');
    const longText = 'This is a long text that exceeds the minimum character requirement for the text upload form. It should be at least 100 characters long to pass validation.';
    
    fireEvent.change(textarea, { target: { value: longText } });

    // Value should be maintained even when generating
    expect(textarea).toHaveValue(longText);
  });

  it('should not show remaining characters when text is empty', () => {
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    fireEvent.change(textarea, { target: { value: '' } });

    expect(screen.queryByText(/more needed/)).not.toBeInTheDocument();
  });

  it('should show file icon in submit button', () => {
    const longText = 'This is a long text that exceeds the minimum character requirement for the text upload form. It should be at least 100 characters long to pass validation.';
    
    render(<TextUploadForm {...mockProps} />);

    const textarea = screen.getByLabelText('Text Content');
    fireEvent.change(textarea, { target: { value: longText } });

    const button = screen.getByRole('button', { name: /generate content/i });
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
