import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UploadTabs } from '@/components/dashboard/upload/UploadTabs';

// Mock the child components
jest.mock('@/components/dashboard/upload/YoutubeUploadForm', () => ({
  YoutubeUploadForm: ({ onSubmit, isGenerating, error, progress }: any) => (
    <div data-testid="youtube-form">
      <button
        onClick={() => onSubmit({ url: 'https://youtube.com/watch?v=test' })}
      >
        Submit YouTube
      </button>
      {isGenerating && (
        <div data-testid="youtube-generating">Generating...</div>
      )}
      {error && <div data-testid="youtube-error">{error}</div>}
      {progress && <div data-testid="youtube-progress">{progress.message}</div>}
    </div>
  ),
}));

jest.mock('@/components/dashboard/upload/AudioUploadForm', () => ({
  AudioUploadForm: ({
    onSubmit,
    onFileUpload,
    audioFile,
    isGenerating,
    error,
    progress,
  }: any) => (
    <div data-testid="audio-form">
      <button onClick={onSubmit}>Submit Audio</button>
      <label htmlFor="audio-file-input" style={{ display: 'none' }}>
        Audio file
      </label>
      <input
        id="audio-file-input"
        type="file"
        onChange={onFileUpload}
        data-testid="audio-file-input"
        accept="audio/*"
        aria-label="Audio file"
      />
      {audioFile && <div data-testid="audio-file">{audioFile.name}</div>}
      {isGenerating && <div data-testid="audio-generating">Generating...</div>}
      {error && <div data-testid="audio-error">{error}</div>}
      {progress && <div data-testid="audio-progress">{progress.message}</div>}
    </div>
  ),
}));

jest.mock('@/components/dashboard/upload/TextUploadForm', () => ({
  TextUploadForm: ({ onSubmit, isGenerating, error, progress }: any) => (
    <div data-testid="text-form">
      <button onClick={() => onSubmit({ text: 'Test text content' })}>
        Submit Text
      </button>
      {isGenerating && <div data-testid="text-generating">Generating...</div>}
      {error && <div data-testid="text-error">{error}</div>}
      {progress && <div data-testid="text-progress">{progress.message}</div>}
    </div>
  ),
}));

describe('UploadTabs', () => {
  const mockProps = {
    isGenerating: false,
    onYoutubeSubmit: jest.fn(),
    onAudioSubmit: jest.fn(),
    onTextSubmit: jest.fn(),
    audioFile: null,
    onFileUpload: jest.fn(),
    error: null,
    progress: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all three tabs', () => {
    render(<UploadTabs {...mockProps} />);

    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('should render YouTube form by default', () => {
    render(<UploadTabs {...mockProps} />);

    expect(screen.getByTestId('youtube-form')).toBeInTheDocument();
    expect(screen.queryByTestId('audio-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('text-form')).not.toBeInTheDocument();
  });

  it('should switch to audio tab when clicked', () => {
    render(<UploadTabs {...mockProps} />);

    const audioTab = screen.getByText('Audio');
    fireEvent.click(audioTab);

    expect(screen.getByTestId('audio-form')).toBeInTheDocument();
    expect(screen.queryByTestId('youtube-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('text-form')).not.toBeInTheDocument();
  });

  it('should switch to text tab when clicked', () => {
    render(<UploadTabs {...mockProps} />);

    const textTab = screen.getByText('Text');
    fireEvent.click(textTab);

    expect(screen.getByTestId('text-form')).toBeInTheDocument();
    expect(screen.queryByTestId('youtube-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('audio-form')).not.toBeInTheDocument();
  });

  it('should disable tabs when generating', () => {
    render(<UploadTabs {...mockProps} isGenerating={true} />);

    const youtubeTab = screen.getByText('YouTube');
    const audioTab = screen.getByText('Audio');
    const textTab = screen.getByText('Text');

    expect(youtubeTab).toHaveAttribute('disabled');
    expect(audioTab).toHaveAttribute('disabled');
    expect(textTab).toHaveAttribute('disabled');
  });

  it('should pass props to YouTube form', () => {
    const error = 'Test error';
    const progress = { message: 'Test progress' };

    render(<UploadTabs {...mockProps} error={error} progress={progress} />);

    expect(screen.getByTestId('youtube-error')).toHaveTextContent(error);
    expect(screen.getByTestId('youtube-progress')).toHaveTextContent(
      progress.message
    );
  });

  it('should pass props to audio form', () => {
    const audioFile = new File(['content'], 'test.mp3', { type: 'audio/mpeg' });
    const error = 'Test error';
    const progress = { message: 'Test progress' };

    render(
      <UploadTabs
        {...mockProps}
        audioFile={audioFile}
        error={error}
        progress={progress}
      />
    );

    // Switch to audio tab
    const audioTab = screen.getByText('Audio');
    fireEvent.click(audioTab);

    expect(screen.getByTestId('audio-file')).toHaveTextContent('test.mp3');
    expect(screen.getByTestId('audio-error')).toHaveTextContent(error);
    expect(screen.getByTestId('audio-progress')).toHaveTextContent(
      progress.message
    );
  });

  it('should pass props to text form', () => {
    const error = 'Test error';
    const progress = { message: 'Test progress' };

    render(<UploadTabs {...mockProps} error={error} progress={progress} />);

    // Switch to text tab
    const textTab = screen.getByText('Text');
    fireEvent.click(textTab);

    expect(screen.getByTestId('text-error')).toHaveTextContent(error);
    expect(screen.getByTestId('text-progress')).toHaveTextContent(
      progress.message
    );
  });

  it('should call onYoutubeSubmit when YouTube form is submitted', () => {
    render(<UploadTabs {...mockProps} />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    expect(mockProps.onYoutubeSubmit).toHaveBeenCalledWith({
      url: 'https://youtube.com/watch?v=test',
    });
  });

  it('should call onAudioSubmit when audio form is submitted', () => {
    render(<UploadTabs {...mockProps} />);

    // Switch to audio tab
    const audioTab = screen.getByText('Audio');
    fireEvent.click(audioTab);

    const submitButton = screen.getByText('Submit Audio');
    fireEvent.click(submitButton);

    expect(mockProps.onAudioSubmit).toHaveBeenCalled();
  });

  it('should call onTextSubmit when text form is submitted', () => {
    render(<UploadTabs {...mockProps} />);

    // Switch to text tab
    const textTab = screen.getByText('Text');
    fireEvent.click(textTab);

    const submitButton = screen.getByText('Submit Text');
    fireEvent.click(submitButton);

    expect(mockProps.onTextSubmit).toHaveBeenCalledWith({
      text: 'Test text content',
    });
  });

  it('should call onFileUpload when file is selected', () => {
    render(<UploadTabs {...mockProps} />);

    // Switch to audio tab
    const audioTab = screen.getByText('Audio');
    fireEvent.click(audioTab);

    const fileInput = screen.getByTestId('audio-file-input');
    const file = new File(['content'], 'test.mp3', { type: 'audio/mpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockProps.onFileUpload).toHaveBeenCalled();
  });

  it('should show generating state in all forms', () => {
    render(<UploadTabs {...mockProps} isGenerating={true} />);

    expect(screen.getByTestId('youtube-generating')).toBeInTheDocument();

    // Switch to audio tab
    const audioTab = screen.getByText('Audio');
    fireEvent.click(audioTab);
    expect(screen.getByTestId('audio-generating')).toBeInTheDocument();

    // Switch to text tab
    const textTab = screen.getByText('Text');
    fireEvent.click(textTab);
    expect(screen.getByTestId('text-generating')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<UploadTabs {...mockProps} />);

    const tabsList = screen.getByTestId('upload-tabs');
    expect(tabsList).toBeInTheDocument();

    const youtubeTab = screen.getByText('YouTube');
    const audioTab = screen.getByText('Audio');
    const textTab = screen.getByText('Text');

    expect(youtubeTab).toHaveAttribute('role', 'tab');
    expect(audioTab).toHaveAttribute('role', 'tab');
    expect(textTab).toHaveAttribute('role', 'tab');
  });

  it('should show responsive text on small screens', () => {
    // Mock window.innerWidth for mobile view
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });

    render(<UploadTabs {...mockProps} />);

    // The component should show abbreviated text on small screens
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
