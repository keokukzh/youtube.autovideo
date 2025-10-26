import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OutputCard } from '@/components/dashboard/outputs/OutputCard';

// Mock the useClipboard hook
jest.mock('@/lib/hooks/use-clipboard', () => ({
  useClipboard: jest.fn(() => ({
    copied: false,
    copyToClipboard: jest.fn(),
  })),
}));

// Mock the useDownload hook
jest.mock('@/lib/hooks/use-download', () => ({
  useDownload: jest.fn(() => ({
    downloading: false,
    downloadAsFile: jest.fn(),
  })),
}));

import { useClipboard } from '@/lib/hooks/use-clipboard';
import { useDownload } from '@/lib/hooks/use-download';

const mockUseClipboard = useClipboard as jest.MockedFunction<
  typeof useClipboard
>;
const mockUseDownload = useDownload as jest.MockedFunction<typeof useDownload>;

describe('OutputCard', () => {
  const mockOutput = {
    id: 'output-1',
    title: 'Twitter Post',
    content: 'This is a sample Twitter post content.',
    format: 'twitter',
    icon: 'Twitter',
  };

  const mockOnCopy = jest.fn();
  const mockOnDownload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render output card with content', () => {
    render(
      <OutputCard
        output={mockOutput}
        onCopy={mockOnCopy}
        onDownload={mockOnDownload}
      />
    );

    expect(screen.getByText('Twitter Post')).toBeInTheDocument();
    expect(
      screen.getByText('This is a sample Twitter post content.')
    ).toBeInTheDocument();
  });

  it('should handle copy action', async () => {
    const mockCopyToClipboard = jest.fn().mockResolvedValue(true);
    mockUseClipboard.mockReturnValue({
      copied: false,
      copyToClipboard: mockCopyToClipboard,
    });

    render(
      <OutputCard
        output={mockOutput}
        onCopy={mockOnCopy}
        onDownload={mockOnDownload}
      />
    );

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(
        'This is a sample Twitter post content.'
      );
      expect(mockOnCopy).toHaveBeenCalledWith('output-1');
    });
  });

  it('should handle download action', async () => {
    const mockDownloadAsFile = jest.fn();
    mockUseDownload.mockReturnValue({
      downloading: false,
      downloadAsFile: mockDownloadAsFile,
    });

    render(
      <OutputCard
        output={mockOutput}
        onCopy={mockOnCopy}
        onDownload={mockOnDownload}
      />
    );

    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockDownloadAsFile).toHaveBeenCalledWith(
        'This is a sample Twitter post content.',
        'twitter-post.txt',
        'text/plain'
      );
      expect(mockOnDownload).toHaveBeenCalledWith('output-1');
    });
  });

  it('should show copied state when copy is successful', () => {
    mockUseClipboard.mockReturnValue({
      copied: true,
      copyToClipboard: jest.fn(),
    });

    render(
      <OutputCard
        output={mockOutput}
        onCopy={mockOnCopy}
        onDownload={mockOnDownload}
      />
    );

    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('should show downloading state when download is in progress', () => {
    mockUseDownload.mockReturnValue({
      downloading: true,
      downloadAsFile: jest.fn(),
    });

    render(
      <OutputCard
        output={mockOutput}
        onCopy={mockOnCopy}
        onDownload={mockOnDownload}
      />
    );

    expect(screen.getByText('Downloading...')).toBeInTheDocument();
  });

  it('should handle different output formats', () => {
    const blogOutput = {
      ...mockOutput,
      title: 'Blog Article',
      format: 'blog',
      icon: 'FileText',
    };

    render(
      <OutputCard
        output={blogOutput}
        onCopy={mockOnCopy}
        onDownload={mockOnDownload}
      />
    );

    expect(screen.getByText('Blog Article')).toBeInTheDocument();
  });

  it('should handle long content with truncation', () => {
    const longContentOutput = {
      ...mockOutput,
      content:
        'This is a very long content that should be truncated when displayed in the card to prevent the card from becoming too tall and affecting the layout of the grid.',
    };

    render(
      <OutputCard
        output={longContentOutput}
        onCopy={mockOnCopy}
        onDownload={mockOnDownload}
      />
    );

    expect(screen.getByText(/This is a very long content/)).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(
      <OutputCard
        output={mockOutput}
        onCopy={mockOnCopy}
        onDownload={mockOnDownload}
      />
    );

    // Check for proper button labels
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('should handle copy error gracefully', async () => {
    const mockCopyToClipboard = jest
      .fn()
      .mockRejectedValue(new Error('Copy failed'));
    mockUseClipboard.mockReturnValue({
      copied: false,
      copyToClipboard: mockCopyToClipboard,
    });

    render(
      <OutputCard
        output={mockOutput}
        onCopy={mockOnCopy}
        onDownload={mockOnDownload}
      />
    );

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalled();
      // Should not call onCopy if copy failed
      expect(mockOnCopy).not.toHaveBeenCalled();
    });
  });
});
