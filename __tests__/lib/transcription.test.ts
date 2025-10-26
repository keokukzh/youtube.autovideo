import { transcribeAudio } from '@/lib/transcription';

// Mock OpenAI
jest.mock('openai', () => {
  const mockOpenAI = jest.fn().mockImplementation(() => ({
    audio: {
      transcriptions: {
        create: jest.fn().mockResolvedValue({
          text: 'This is a test transcription',
        }),
      },
    },
  }));

  return {
    default: mockOpenAI,
    OpenAI: mockOpenAI,
  };
});

describe('transcription', () => {
  it('should transcribe audio file', async () => {
    const mockFile = new File(['test audio'], 'test.mp3', {
      type: 'audio/mp3',
    });

    const result = await transcribeAudio(mockFile);

    expect(result).toBe('This is a test transcription');
  });
});
