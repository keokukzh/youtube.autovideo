import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UploadManager } from '@/components/dashboard/upload/UploadManager';
import { GenerationService } from '@/lib/services/GenerationService';

// Mock the GenerationService
jest.mock('@/lib/services/GenerationService', () => ({
  GenerationService: {
    generateContent: jest.fn(),
  },
}));

// Mock the useGenerationPolling hook
jest.mock('@/lib/hooks/use-generation-polling', () => ({
  useGenerationPolling: jest.fn(() => ({
    status: 'idle',
    progress: 0,
    message: '',
    error: null,
  })),
}));

// Mock the useCredits hook
jest.mock('@/lib/hooks/use-credits', () => ({
  useCredits: jest.fn(() => ({
    credits: 50,
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

const mockGenerateContent =
  GenerationService.generateContent as jest.MockedFunction<
    typeof GenerationService.generateContent
  >;

describe('UploadManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render upload interface', () => {
    render(<UploadManager />);

    expect(screen.getByText('Upload Content')).toBeInTheDocument();
    expect(screen.getByText('YouTube Video')).toBeInTheDocument();
    expect(screen.getByText('Audio File')).toBeInTheDocument();
    expect(screen.getByText('Text Input')).toBeInTheDocument();
  });

  it('should handle YouTube URL submission', async () => {
    mockGenerateContent.mockResolvedValue({
      id: 'gen-123',
      status: 'processing',
    });

    render(<UploadManager />);

    // Switch to YouTube tab
    fireEvent.click(screen.getByText('YouTube Video'));

    // Fill in URL
    const urlInput = screen.getByPlaceholderText('Enter YouTube URL');
    fireEvent.change(urlInput, {
      target: { value: 'https://youtube.com/watch?v=123' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /generate content/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockGenerateContent).toHaveBeenCalledWith({
        type: 'youtube',
        url: 'https://youtube.com/watch?v=123',
      });
    });
  });

  it('should handle audio file submission', async () => {
    mockGenerateContent.mockResolvedValue({
      id: 'gen-123',
      status: 'processing',
    });

    render(<UploadManager />);

    // Switch to Audio tab
    fireEvent.click(screen.getByText('Audio File'));

    // Create a mock file
    const file = new File(['audio content'], 'test.mp3', {
      type: 'audio/mpeg',
    });
    const fileInput = screen.getByLabelText(/upload audio file/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /generate content/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockGenerateContent).toHaveBeenCalledWith({
        type: 'audio',
        file: expect.any(File),
      });
    });
  });

  it('should handle text input submission', async () => {
    mockGenerateContent.mockResolvedValue({
      id: 'gen-123',
      status: 'processing',
    });

    render(<UploadManager />);

    // Switch to Text tab
    fireEvent.click(screen.getByText('Text Input'));

    // Fill in text
    const textInput = screen.getByPlaceholderText('Enter your text content...');
    fireEvent.change(textInput, { target: { value: 'Test content' } });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /generate content/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockGenerateContent).toHaveBeenCalledWith({
        type: 'text',
        content: 'Test content',
      });
    });
  });

  it('should show error when generation fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Generation failed'));

    render(<UploadManager />);

    // Switch to Text tab
    fireEvent.click(screen.getByText('Text Input'));

    // Fill in text
    const textInput = screen.getByPlaceholderText('Enter your text content...');
    fireEvent.change(textInput, { target: { value: 'Test content' } });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /generate content/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Generation failed')).toBeInTheDocument();
    });
  });

  it('should disable submit button when no content is provided', () => {
    render(<UploadManager />);

    const submitButton = screen.getByRole('button', {
      name: /generate content/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when content is provided', () => {
    render(<UploadManager />);

    // Switch to Text tab
    fireEvent.click(screen.getByText('Text Input'));

    // Fill in text
    const textInput = screen.getByPlaceholderText('Enter your text content...');
    fireEvent.change(textInput, { target: { value: 'Test content' } });

    const submitButton = screen.getByRole('button', {
      name: /generate content/i,
    });
    expect(submitButton).toBeEnabled();
  });
});
