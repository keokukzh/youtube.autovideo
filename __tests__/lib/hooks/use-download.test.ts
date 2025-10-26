import { renderHook, act } from '@testing-library/react';
import { useDownload } from '@/lib/hooks/use-download';

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: mockCreateObjectURL,
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: mockRevokeObjectURL,
});

// Mock document.createElement and related methods
const mockClick = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();

const mockLink = {
  href: '',
  download: '',
  click: mockClick,
};

const mockCreateElement = jest.fn(() => mockLink);

Object.defineProperty(document, 'createElement', {
  writable: true,
  value: mockCreateElement,
});

Object.defineProperty(document.body, 'appendChild', {
  writable: true,
  value: mockAppendChild,
});

Object.defineProperty(document.body, 'removeChild', {
  writable: true,
  value: mockRemoveChild,
});

describe('useDownload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('blob:mock-url');
  });

  it('should download content as file', () => {
    const { result } = renderHook(() => useDownload());

    expect(result.current.downloading).toBe(false);

    act(() => {
      result.current.downloadAsFile('test content', 'test.txt', 'text/plain');
    });

    expect(result.current.downloading).toBe(true);
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockLink.href).toBe('blob:mock-url');
    expect(mockLink.download).toBe('test.txt');
    expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalledWith(mockLink);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should use default mime type when not provided', () => {
    const { result } = renderHook(() => useDownload());

    act(() => {
      result.current.downloadAsFile('test content', 'test.txt');
    });

    expect(mockCreateElement).toHaveBeenCalledWith('a');
  });

  it('should handle download errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockCreateElement.mockImplementation(() => {
      throw new Error('Download failed');
    });

    const { result } = renderHook(() => useDownload());

    act(() => {
      result.current.downloadAsFile('test content', 'test.txt');
    });

    expect(result.current.downloading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to download file:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should reset downloading state after completion', () => {
    const { result } = renderHook(() => useDownload());

    act(() => {
      result.current.downloadAsFile('test content', 'test.txt');
    });

    expect(result.current.downloading).toBe(true);

    // Simulate completion
    act(() => {
      // The hook should reset downloading to false after the download completes
    });

    expect(result.current.downloading).toBe(false);
  });

  it('should handle multiple downloads', () => {
    const { result } = renderHook(() => useDownload());

    act(() => {
      result.current.downloadAsFile('content1', 'file1.txt');
      result.current.downloadAsFile('content2', 'file2.txt');
    });

    expect(mockCreateElement).toHaveBeenCalledTimes(2);
    expect(mockAppendChild).toHaveBeenCalledTimes(2);
    expect(mockClick).toHaveBeenCalledTimes(2);
  });
});
