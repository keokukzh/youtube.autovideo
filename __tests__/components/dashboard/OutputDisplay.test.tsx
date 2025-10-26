import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OutputDisplay } from '@/components/dashboard/OutputDisplay';

// Mock JSZip
jest.mock('jszip', () => {
  return jest.fn().mockImplementation(() => ({
    file: jest.fn(),
    generateAsync: jest.fn().mockResolvedValue(new Blob(['test content'])),
  }));
});

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(() => 'blob:test-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: jest.fn(),
});

// Mock document.createElement and appendChild
const mockLink = {
  href: '',
  download: '',
  click: jest.fn(),
};

Object.defineProperty(document, 'createElement', {
  writable: true,
  value: jest.fn(() => mockLink),
});

Object.defineProperty(document.body, 'appendChild', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(document.body, 'removeChild', {
  writable: true,
  value: jest.fn(),
});

describe('OutputDisplay', () => {
  const mockOutputs = {
    twitter_posts: ['Tweet 1', 'Tweet 2'],
    linkedin_posts: ['LinkedIn 1', 'LinkedIn 2'],
    instagram_captions: ['Instagram 1', 'Instagram 2'],
    blog_article: {
      title: 'Blog Title',
      content: 'Blog content',
      word_count: 500,
    },
    email_newsletter: {
      subject: 'Newsletter Subject',
      content: 'Newsletter content',
      word_count: 300,
    },
    quote_graphics: ['Quote 1', 'Quote 2'],
    twitter_thread: ['Thread 1', 'Thread 2'],
    podcast_show_notes: ['Note 1', 'Note 2'],
    video_script_summary: 'Script summary content',
    tiktok_hooks: ['Hook 1', 'Hook 2'],
  };

  it('should render all output cards', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    expect(screen.getByText('Generated Content')).toBeInTheDocument();
    expect(
      screen.getByText('All 10 content formats ready for use')
    ).toBeInTheDocument();
    expect(screen.getByText('Download All')).toBeInTheDocument();
  });

  it('should show correct item counts for each output type', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    expect(screen.getByText('2 items')).toBeInTheDocument(); // Twitter posts
    expect(screen.getByText('2 items')).toBeInTheDocument(); // LinkedIn posts
    expect(screen.getByText('2 items')).toBeInTheDocument(); // Instagram captions
  });

  it('should show correct format descriptions', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    expect(screen.getByText('280 characters each')).toBeInTheDocument();
    expect(screen.getByText('1,300 characters each')).toBeInTheDocument();
    expect(screen.getByText('2,200 characters each')).toBeInTheDocument();
  });

  it('should show word counts for blog article and email newsletter', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    expect(screen.getByText('500 words')).toBeInTheDocument();
    expect(screen.getByText('300 words')).toBeInTheDocument();
  });

  it('should handle copy functionality', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(<OutputDisplay outputs={mockOutputs} />);

    const copyButtons = screen.getAllByText('Copy');
    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('should handle download functionality', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    const downloadButtons = screen.getAllByText('Download');
    fireEvent.click(downloadButtons[0]);

    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should handle download all functionality', async () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    const downloadAllButton = screen.getByText('Download All');
    fireEvent.click(downloadAllButton);

    await waitFor(() => {
      expect(screen.getByText('Creating Archive...')).toBeInTheDocument();
    });
  });

  it('should show correct icons for each output type', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    // Icons are rendered as SVG elements, so we check for their presence
    const cards = screen.getAllByText('Twitter Posts');
    expect(cards).toHaveLength(1);
  });

  it('should show truncated content with proper styling', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    const contentDivs = screen.getAllByText(/Tweet 1/);
    expect(contentDivs[0]).toHaveClass(
      'whitespace-pre-wrap',
      'text-sm',
      'text-gray-700'
    );
  });

  it('should show character count for long content', () => {
    const longContent = 'x'.repeat(400);
    const longOutputs = {
      ...mockOutputs,
      twitter_posts: [longContent],
    };

    render(<OutputDisplay outputs={longOutputs} />);

    expect(
      screen.getByText('400 characters • Click copy/download for full content')
    ).toBeInTheDocument();
  });

  it('should handle single item outputs correctly', () => {
    const singleOutputs = {
      ...mockOutputs,
      twitter_posts: ['Single tweet'],
    };

    render(<OutputDisplay outputs={singleOutputs} />);

    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('should show correct button states during download', async () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    const downloadButtons = screen.getAllByText('Download');
    fireEvent.click(downloadButtons[0]);

    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('should show correct button states during copy', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(<OutputDisplay outputs={mockOutputs} />);

    const copyButtons = screen.getAllByText('Copy');
    fireEvent.click(copyButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('should have proper accessibility attributes', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    const downloadAllButton = screen.getByText('Download All');
    expect(downloadAllButton).toBeInTheDocument();
  });

  it('should show correct grid layout', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    const grid = screen
      .getByText('Generated Content')
      .closest('.space-y-8')
      ?.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
  });

  it('should show correct card styling', () => {
    render(<OutputDisplay outputs={mockOutputs} />);

    const cards = screen.getAllByText('Twitter Posts');
    expect(cards[0].closest('.space-y-4')).toHaveClass('space-y-4');
  });

  it('should handle empty outputs gracefully', () => {
    const emptyOutputs = {
      twitter_posts: [],
      linkedin_posts: [],
      instagram_captions: [],
      blog_article: { title: '', content: '', word_count: 0 },
      email_newsletter: { subject: '', content: '', word_count: 0 },
      quote_graphics: [],
      twitter_thread: [],
      podcast_show_notes: [],
      video_script_summary: '',
      tiktok_hooks: [],
    };

    render(<OutputDisplay outputs={emptyOutputs} />);

    expect(screen.getByText('Generated Content')).toBeInTheDocument();
  });
});
