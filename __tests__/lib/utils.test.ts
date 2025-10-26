import {
  cn,
  formatDate,
  truncateText,
  generateId,
  copyToClipboard,
  downloadFile,
  isValidYouTubeUrl,
  extractYouTubeId,
  formatFileSize,
  sleep,
} from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      expect(cn('class1', true && 'class2', false && 'class3')).toBe(
        'class1 class2'
      );
    });

    it('should handle undefined and null values', () => {
      expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
    });

    it('should handle empty strings', () => {
      expect(cn('class1', '', 'class2')).toBe('class1 class2');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-01T00:00:00Z');
      expect(formatDate(date)).toBe('Jan 1, 2024');
    });

    it('should handle string dates', () => {
      expect(formatDate('2024-01-01T00:00:00Z')).toBe('Jan 1, 2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very lo...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('should handle empty text', () => {
      expect(truncateText('', 20)).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(truncateText(null, 20)).toBe('');
      expect(truncateText(undefined, 20)).toBe('');
    });
  });

  describe('generateId', () => {
    it('should generate a string ID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('copyToClipboard', () => {
    beforeEach(() => {
      // Mock navigator.clipboard
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      });
    });

    it('should copy text to clipboard', async () => {
      const text = 'Test text';
      await copyToClipboard(text);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    });

    it('should handle clipboard errors', async () => {
      const error = new Error('Clipboard error');
      jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(error);

      await expect(copyToClipboard('test')).rejects.toThrow('Clipboard error');
    });
  });

  describe('downloadFile', () => {
    beforeEach(() => {
      // Mock URL.createObjectURL and URL.revokeObjectURL
      global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
      global.URL.revokeObjectURL = jest.fn();

      // Mock document.createElement and appendChild
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      document.createElement = jest.fn(() => mockLink as any);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();
    });

    it('should download file with correct name', () => {
      const content = 'Test content';
      const filename = 'test.txt';

      downloadFile(content, filename);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });

  describe('isValidYouTubeUrl', () => {
    it('should validate YouTube URLs', () => {
      const validUrls = [
        'https://youtube.com/watch?v=test',
        'https://www.youtube.com/watch?v=test',
        'https://youtu.be/test',
        'http://youtube.com/watch?v=test',
      ];

      validUrls.forEach((url) => {
        expect(isValidYouTubeUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'https://example.com',
        'not-a-url',
        'https://youtube.com/invalid',
        '',
      ];

      invalidUrls.forEach((url) => {
        expect(isValidYouTubeUrl(url)).toBe(false);
      });
    });
  });

  describe('extractYouTubeId', () => {
    it('should extract YouTube ID from watch URL', () => {
      const url = 'https://youtube.com/watch?v=test1234567';
      expect(extractYouTubeId(url)).toBe('test1234567');
    });

    it('should extract YouTube ID from youtu.be URL', () => {
      const url = 'https://youtu.be/test1234567';
      expect(extractYouTubeId(url)).toBe('test1234567');
    });

    it('should return null for invalid URLs', () => {
      const invalidUrls = [
        'https://example.com',
        'not-a-url',
        '',
        null,
        undefined,
      ];

      invalidUrls.forEach((url) => {
        expect(extractYouTubeId(url)).toBeNull();
      });
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal places', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB');
    });

    it('should handle very large files', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
    });
  });

  describe('sleep', () => {
    it('should wait for specified time', async () => {
      const start = Date.now();
      await sleep(100);
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(100);
    });

    it('should handle zero delay', async () => {
      const start = Date.now();
      await sleep(0);
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(0);
    });
  });
});
