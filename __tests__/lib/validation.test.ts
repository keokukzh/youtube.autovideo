import {
  generateRequestSchema,
  youtubeUrlSchema,
  audioFileSchema,
  textInputSchema,
  authSchema,
  validateRequest,
  safeValidateRequest,
} from '@/lib/validation';

describe('Validation Schemas', () => {
  describe('generateRequestSchema', () => {
    it('should validate a valid YouTube request', () => {
      const validData = {
        input_type: 'youtube',
        input_url: 'https://youtube.com/watch?v=test',
      };

      const result = generateRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate a valid text request', () => {
      const validData = {
        input_type: 'text',
        input_text:
          'This is a test text input with enough characters to meet the minimum requirement. This text needs to be at least 100 characters long to pass validation.',
      };

      const result = generateRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate a valid audio request', () => {
      const validData = {
        input_type: 'audio',
      };

      const result = generateRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid input type', () => {
      const invalidData = {
        input_type: 'invalid',
        input_url: 'https://youtube.com/watch?v=test',
      };

      const result = generateRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject YouTube request without URL', () => {
      const invalidData = {
        input_type: 'youtube',
      };

      const result = generateRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject text request without text', () => {
      const invalidData = {
        input_type: 'text',
      };

      const result = generateRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject text that is too short', () => {
      const invalidData = {
        input_type: 'text',
        input_text: 'Too short',
      };

      const result = generateRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject text that is too long', () => {
      const invalidData = {
        input_type: 'text',
        input_text: 'a'.repeat(50001),
      };

      const result = generateRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('youtubeUrlSchema', () => {
    it('should validate a valid YouTube URL', () => {
      const validUrls = [
        'https://youtube.com/watch?v=test',
        'https://www.youtube.com/watch?v=test',
        'https://youtu.be/test',
        'http://youtube.com/watch?v=test',
      ];

      validUrls.forEach((url) => {
        const result = youtubeUrlSchema.safeParse(url);
        expect(result.success).toBe(true);
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
        const result = youtubeUrlSchema.safeParse(url);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('audioFileSchema', () => {
    it('should validate a valid audio file', () => {
      const validFile = {
        name: 'test.mp3',
        size: 1024 * 1024, // 1MB
        type: 'audio/mpeg',
      };

      const result = audioFileSchema.safeParse(validFile);
      expect(result.success).toBe(true);
    });

    it('should reject file that is too large', () => {
      const invalidFile = {
        name: 'test.mp3',
        size: 26 * 1024 * 1024, // 26MB
        type: 'audio/mpeg',
      };

      const result = audioFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
    });

    it('should reject unsupported file type', () => {
      const invalidFile = {
        name: 'test.txt',
        size: 1024,
        type: 'text/plain',
      };

      const result = audioFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
    });

    it('should reject file without name', () => {
      const invalidFile = {
        size: 1024,
        type: 'audio/mpeg',
      };

      const result = audioFileSchema.safeParse(invalidFile);
      expect(result.success).toBe(false);
    });
  });

  describe('textInputSchema', () => {
    it('should validate valid text input', () => {
      const validText = {
        text: 'This is a valid text input with enough characters to meet the minimum requirement. This text needs to be at least 100 characters long to pass validation.',
      };

      const result = textInputSchema.safeParse(validText);
      expect(result.success).toBe(true);
    });

    it('should reject text that is too short', () => {
      const invalidText = {
        text: 'Too short',
      };

      const result = textInputSchema.safeParse(invalidText);
      expect(result.success).toBe(false);
    });

    it('should reject text that is too long', () => {
      const invalidText = {
        text: 'a'.repeat(50001),
      };

      const result = textInputSchema.safeParse(invalidText);
      expect(result.success).toBe(false);
    });

    it('should reject text with only whitespace', () => {
      const invalidText = {
        text: '   \n\t   ',
      };

      const result = textInputSchema.safeParse(invalidText);
      expect(result.success).toBe(false);
    });
  });

  describe('authSchema', () => {
    it('should validate valid auth data', () => {
      const validAuth = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = authSchema.safeParse(validAuth);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidAuth = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = authSchema.safeParse(invalidAuth);
      expect(result.success).toBe(false);
    });

    it('should reject password that is too short', () => {
      const invalidAuth = {
        email: 'test@example.com',
        password: 'short',
      };

      const result = authSchema.safeParse(invalidAuth);
      expect(result.success).toBe(false);
    });

    it('should reject password that is too long', () => {
      const invalidAuth = {
        email: 'test@example.com',
        password: 'a'.repeat(129),
      };

      const result = authSchema.safeParse(invalidAuth);
      expect(result.success).toBe(false);
    });
  });
});

describe('Validation Utilities', () => {
  describe('validateRequest', () => {
    it('should return parsed data for valid input', () => {
      const validData = {
        input_type: 'youtube',
        input_url: 'https://youtube.com/watch?v=test',
      };

      const result = validateRequest(generateRequestSchema, validData);
      expect(result).toEqual(validData);
    });

    it('should throw error for invalid input', () => {
      const invalidData = {
        input_type: 'invalid',
      };

      expect(() => {
        validateRequest(generateRequestSchema, invalidData);
      }).toThrow('Validation error');
    });
  });

  describe('safeValidateRequest', () => {
    it('should return success for valid input', () => {
      const validData = {
        input_type: 'youtube',
        input_url: 'https://youtube.com/watch?v=test',
      };

      const result = safeValidateRequest(generateRequestSchema, validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should return error for invalid input', () => {
      const invalidData = {
        input_type: 'invalid',
      };

      const result = safeValidateRequest(generateRequestSchema, invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Validation error');
      }
    });
  });
});
