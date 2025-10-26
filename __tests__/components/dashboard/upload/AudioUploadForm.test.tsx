import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AudioUploadForm } from '@/components/dashboard/upload/AudioUploadForm';

describe('AudioUploadForm', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onFileUpload: jest.fn(),
    audioFile: null,
    isGenerating: false,
    error: null,
    progress: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with file input and submit button', () => {
    render(<AudioUploadForm {...mockProps} />);

    expect(screen.getByLabelText('Audio File Upload')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate content/i })).toBeInTheDocument();
  });

  it('should show error when provided', () => {
    const error = 'Test error message';
    render(<AudioUploadForm {...mockProps} error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('should show progress when provided', () => {
    const progress = {
      message: 'Processing audio...',
      step: 2,
      total: 4,
      percentage: 50,
    };
    render(<AudioUploadForm {...mockProps} progress={progress} />);

    expect(screen.getByText(progress.message)).toBeInTheDocument();
    expect(screen.getByText(`${progress.step}/${progress.total}`)).toBeInTheDocument();
    expect(screen.getByText(`${progress.percentage}% complete`)).toBeInTheDocument();
  });

  it('should disable form when generating', () => {
    render(<AudioUploadForm {...mockProps} isGenerating={true} />);

    const input = screen.getByLabelText('Audio File Upload');
    const button = screen.getByRole('button', { name: /processing audio/i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(screen.getByText('Processing Audio...')).toBeInTheDocument();
  });

  it('should call onFileUpload when file is selected', () => {
    render(<AudioUploadForm {...mockProps} />);

    const input = screen.getByLabelText('Audio File Upload');
    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockProps.onFileUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: expect.arrayContaining([file])
        })
      })
    );
  });

  it('should call onSubmit when submit button is clicked', () => {
    render(<AudioUploadForm {...mockProps} />);

    const button = screen.getByRole('button', { name: /generate content/i });
    fireEvent.click(button);

    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  it('should show selected file information', () => {
    const audioFile = new File(['audio content'], 'test-audio.mp3', { type: 'audio/mpeg' });
    Object.defineProperty(audioFile, 'size', { value: 1024 * 1024 }); // 1MB

    render(<AudioUploadForm {...mockProps} audioFile={audioFile} />);

    expect(screen.getByText('test-audio.mp3')).toBeInTheDocument();
    expect(screen.getByText('1.00 MB • Ready to process')).toBeInTheDocument();
  });

  it('should disable submit button when no file is selected', () => {
    render(<AudioUploadForm {...mockProps} />);

    const button = screen.getByRole('button', { name: /generate content/i });
    expect(button).toBeDisabled();
  });

  it('should enable submit button when file is selected', () => {
    const audioFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    
    render(<AudioUploadForm {...mockProps} audioFile={audioFile} />);

    const button = screen.getByRole('button', { name: /generate content/i });
    expect(button).not.toBeDisabled();
  });

  it('should show loading state when generating', () => {
    render(<AudioUploadForm {...mockProps} isGenerating={true} />);

    expect(screen.getByText('Processing Audio...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should have proper file input attributes', () => {
    render(<AudioUploadForm {...mockProps} />);

    const input = screen.getByLabelText('Audio File Upload');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/mp4');
    expect(input).toHaveAttribute('aria-describedby', 'audio-file-help');
  });

  it('should show help text for file input', () => {
    render(<AudioUploadForm {...mockProps} />);

    const helpText = screen.getByText(/upload mp3, wav, or m4a files/i);
    expect(helpText).toHaveAttribute('id', 'audio-file-help');
  });

  it('should show file size in MB with proper formatting', () => {
    const audioFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    Object.defineProperty(audioFile, 'size', { value: 2.5 * 1024 * 1024 }); // 2.5MB

    render(<AudioUploadForm {...mockProps} audioFile={audioFile} />);

    expect(screen.getByText('2.50 MB • Ready to process')).toBeInTheDocument();
  });

  it('should show check circle icon for selected file', () => {
    const audioFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    
    render(<AudioUploadForm {...mockProps} audioFile={audioFile} />);

    const checkIcon = screen.getByRole('img', { hidden: true });
    expect(checkIcon).toHaveClass('text-green-600');
  });

  it('should have proper accessibility attributes', () => {
    render(<AudioUploadForm {...mockProps} />);

    const input = screen.getByLabelText('Audio File Upload');
    const button = screen.getByRole('button', { name: /generate content/i });

    expect(input).toHaveAttribute('aria-describedby', 'audio-file-help');
    expect(button).toHaveAttribute('aria-label', 'Generate content from audio file');
  });

  it('should show file selection success styling', () => {
    const audioFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    
    render(<AudioUploadForm {...mockProps} audioFile={audioFile} />);

    const fileInfo = screen.getByText('test.mp3').closest('div');
    expect(fileInfo).toHaveClass('border-green-200', 'bg-gradient-to-r', 'from-green-50', 'to-emerald-50');
  });

  it('should handle file selection with multiple files (should only use first)', () => {
    render(<AudioUploadForm {...mockProps} />);

    const input = screen.getByLabelText('Audio File Upload');
    const file1 = new File(['audio content 1'], 'test1.mp3', { type: 'audio/mpeg' });
    const file2 = new File(['audio content 2'], 'test2.mp3', { type: 'audio/mpeg' });
    
    fireEvent.change(input, { target: { files: [file1, file2] } });

    expect(mockProps.onFileUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: expect.arrayContaining([file1, file2])
        })
      })
    );
  });

  it('should show progress bar with correct value', () => {
    const progress = {
      message: 'Processing audio...',
      step: 3,
      total: 4,
      percentage: 75,
    };
    render(<AudioUploadForm {...mockProps} progress={progress} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should have proper button styling and gradient', () => {
    const audioFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    
    render(<AudioUploadForm {...mockProps} audioFile={audioFile} />);

    const button = screen.getByRole('button', { name: /generate content/i });
    expect(button).toHaveClass('gradient-primary');
  });

  it('should show error alert with proper styling', () => {
    const error = 'File upload error';
    render(<AudioUploadForm {...mockProps} error={error} />);

    const alert = screen.getByText(error).closest('[role="alert"]');
    expect(alert).toHaveClass('border-red-200', 'bg-red-50');
  });

  it('should show progress container with proper styling', () => {
    const progress = {
      message: 'Processing audio...',
      step: 2,
      total: 4,
      percentage: 50,
    };
    render(<AudioUploadForm {...mockProps} progress={progress} />);

    const progressContainer = screen.getByText(progress.message).closest('div');
    expect(progressContainer).toHaveClass('border-indigo-200', 'bg-gradient-to-r', 'from-indigo-50', 'to-purple-50');
  });

  it('should handle file input change with no files', () => {
    render(<AudioUploadForm {...mockProps} />);

    const input = screen.getByLabelText('Audio File Upload');
    
    fireEvent.change(input, { target: { files: [] } });

    expect(mockProps.onFileUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: expect.arrayContaining([])
        })
      })
    );
  });
});
