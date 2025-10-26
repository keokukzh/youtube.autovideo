import { z } from 'zod';

/**
 * Validation schema for content generation requests
 *
 * @description Validates input for content generation API endpoint
 * @example
 * ```typescript
 * const result = generateRequestSchema.safeParse({
 *   input_type: 'youtube',
 *   input_url: 'https://youtube.com/watch?v=example'
 * });
 * ```
 */
export const generateRequestSchema = z
  .object({
    input_type: z.enum(['youtube', 'audio', 'text'], {
      errorMap: () => ({
        message: 'Input type must be youtube, audio, or text',
      }),
    }),
    input_url: z.string().url().optional(),
    input_text: z
      .string()
      .min(100, 'Text must be at least 100 characters')
      .max(50000, 'Text must be less than 50,000 characters')
      .optional(),
  })
  .refine(
    (data) => {
      if (data.input_type === 'youtube') return !!data.input_url;
      if (data.input_type === 'text') return !!data.input_text;
      return true;
    },
    {
      message: 'Invalid input for selected type',
      path: ['input_type'],
    }
  );

/**
 * Validation schema for YouTube URLs
 */
export const youtubeUrlSchema = z
  .string()
  .url()
  .refine(
    (url) => {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
      return youtubeRegex.test(url);
    },
    { message: 'Invalid YouTube URL format' }
  );

/**
 * Validation schema for audio file uploads
 */
export const audioFileSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  size: z.number().max(25 * 1024 * 1024, 'File size must be less than 25MB'),
  type: z.enum(
    ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mp4'],
    {
      errorMap: () => ({
        message: 'Unsupported audio format. Use MP3, WAV, or M4A files.',
      }),
    }
  ),
});

/**
 * Validation schema for text input
 */
export const textInputSchema = z.object({
  text: z
    .string()
    .min(100, 'Text must be at least 100 characters')
    .max(50000, 'Text must be less than 50,000 characters')
    .refine((text) => text.trim().length >= 100, {
      message: 'Text must contain at least 100 non-whitespace characters',
    }),
});

/**
 * Validation schema for user authentication
 */
export const authSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
});

/**
 * Validation schema for generation status updates
 */
export const generationStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
]);

/**
 * Validation schema for pagination
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
});

/**
 * Validation schema for generation ID
 */
export const generationIdSchema = z
  .string()
  .uuid('Invalid generation ID format');

/**
 * Type exports for use in other files
 */
export type GenerateRequest = z.infer<typeof generateRequestSchema>;
export type YouTubeUrl = z.infer<typeof youtubeUrlSchema>;
export type AudioFile = z.infer<typeof audioFileSchema>;
export type TextInput = z.infer<typeof textInputSchema>;
export type AuthData = z.infer<typeof authSchema>;
export type GenerationStatus = z.infer<typeof generationStatusSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type GenerationId = z.infer<typeof generationIdSchema>;

/**
 * Utility function to validate and parse request data
 *
 * @template T - The type of the validated data
 * @param schema - Zod schema to validate against
 * @param data - Raw data to validate
 * @returns Parsed and validated data
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const validatedData = validateRequest(generateRequestSchema, rawData);
 *   // Use validatedData safely
 * } catch (error) {
 *   // Handle validation error
 * }
 * ```
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new Error(`Validation error: ${errorMessage}`);
    }
    throw error;
  }
}

/**
 * Utility function to safely validate request data
 */
export function safeValidateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return { success: false, error: `Validation error: ${errorMessage}` };
    }
    return { success: false, error: 'Validation error: Unknown validation error' };
  }
}
