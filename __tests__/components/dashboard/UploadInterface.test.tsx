import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { UploadInterface } from '@/components/dashboard/UploadInterface';
import { mockRouter } from '@/__tests__/utils/test-helpers';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock UploadTabs component
jest.mock('@/components/dashboard/upload/UploadTabs', () => ({
  UploadTabs: ({ onYoutubeSubmit, onAudioSubmit, onTextSubmit, onFileUpload, error, progress, isGenerating, audioFile }: any) => (
    <div data-testid="upload-tabs">
      <button onClick={() => onYoutubeSubmit({ url: 'https://youtube.com/watch?v=test' })}>
        Submit YouTube
      </button>
      <button onClick={onAudioSubmit}>Submit Audio</button>
      <button onClick={() => onTextSubmit({ text: 'Test text content' })}>
        Submit Text
      </button>
      <input
        type="file"
        onChange={onFileUpload}
        data-testid="file-input"
        accept="audio/*"
      />
      {error && <div data-testid="error">{error}</div>}
      {progress && <div data-testid="progress">{progress.message}</div>}
      {isGenerating && <div data-testid="generating">Generating...</div>}
      {audioFile && <div data-testid="audio-file">{audioFile.name}</div>}
    </div>
  ),
}));

describe('UploadInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render upload interface with correct title and description', () => {
    render(<UploadInterface />);

    expect(screen.getByText('Transform Your Content')).toBeInTheDocument();
    expect(screen.getByText(/Upload a YouTube video, audio file, or paste text/)).toBeInTheDocument();
    expect(screen.getByTestId('upload-interface')).toBeInTheDocument();
  });

  it('should handle file upload with valid audio file', () => {
    render(<UploadInterface />);

    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByTestId('audio-file')).toHaveTextContent('test.mp3');
  });

  it('should reject invalid file types', () => {
    render(<UploadInterface />);

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByTestId('error')).toHaveTextContent('Please upload an MP3, WAV, or M4A file');
  });

  it('should reject files that are too large', () => {
    render(<UploadInterface />);

    // Create a file larger than 25MB
    const largeFile = new File(['x'.repeat(26 * 1024 * 1024)], 'large.mp3', { type: 'audio/mpeg' });
    const fileInput = screen.getByTestId('file-input');

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(screen.getByTestId('error')).toHaveTextContent('File too large. Please use files smaller than 25MB');
  });

  it('should handle YouTube submission successfully', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { generation_id: 'test-generation-id' }
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Mock polling response
    const mockPollingResponse = {
      ok: true,
      json: () => Promise.resolve({ status: 'completed' })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockPollingResponse);

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generate', {
        method: 'POST',
        body: expect.any(FormData)
      });
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/generation/test-generation-id');
    }, { timeout: 2000 });
  });

  it('should handle YouTube submission with API error', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: 'API Error' })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('API Error');
    });
  });

  it('should handle text submission successfully', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { generation_id: 'test-generation-id' }
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const mockPollingResponse = {
      ok: true,
      json: () => Promise.resolve({ status: 'completed' })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockPollingResponse);

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit Text');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generate', {
        method: 'POST',
        body: expect.any(FormData)
      });
    });
  });

  it('should handle audio submission with no file selected', async () => {
    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit Audio');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Please select an audio file');
    });
  });

  it('should handle audio submission with file selected', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { generation_id: 'test-generation-id' }
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const mockPollingResponse = {
      ok: true,
      json: () => Promise.resolve({ status: 'completed' })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockPollingResponse);

    render(<UploadInterface />);

    // First upload a file
    const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Then submit
    const submitButton = screen.getByText('Submit Audio');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generate', {
        method: 'POST',
        body: expect.any(FormData)
      });
    });
  });

  it('should show progress during generation', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { generation_id: 'test-generation-id' }
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('progress')).toHaveTextContent('Starting generation...');
    });
  });

  it('should handle polling with different statuses', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { generation_id: 'test-generation-id' }
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Mock polling responses
    const mockPollingResponses = [
      { status: 'pending' },
      { status: 'processing', progress: 75 },
      { status: 'completed' }
    ];

    mockPollingResponses.forEach(response => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(response)
      });
    });

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('progress')).toHaveTextContent('Processing in queue...');
    });
  });

  it('should handle polling timeout', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { generation_id: 'test-generation-id' }
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Mock polling to always return pending (simulate timeout)
    (global.fetch as jest.Mock).mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'pending' })
      })
    );

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    // Fast-forward time to trigger timeout
    act(() => {
      jest.advanceTimersByTime(180000); // 3 minutes
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Generation timeout - please check history');
    });
  });

  it('should handle polling error', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { generation_id: 'test-generation-id' }
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Mock polling to throw error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to check generation status');
    });
  });

  it('should handle generation failure status', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { generation_id: 'test-generation-id' }
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const mockPollingResponse = {
      ok: true,
      json: () => Promise.resolve({ 
        status: 'failed', 
        error: 'Generation failed' 
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockPollingResponse);

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Generation failed');
    });
  });

  it('should clear error when new file is uploaded', () => {
    render(<UploadInterface />);

    // First trigger an error
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(screen.getByTestId('error')).toBeInTheDocument();

    // Then upload a valid file
    const validFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  it('should handle network errors during generation', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Network error');
    });
  });

  it('should handle invalid response from server', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        success: false
      })
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(<UploadInterface />);

    const submitButton = screen.getByText('Submit YouTube');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid response from server');
    });
  });
});
