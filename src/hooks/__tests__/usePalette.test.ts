import { renderHook, act } from '@testing-library/react';
import { usePalette } from '../usePalette';
import { generateNewDistinctPalette, Color } from '../../utils/colorGenerator';

// Mock the color generator utility
vi.mock('../../utils/colorGenerator', () => ({
  generateNewDistinctPalette: vi.fn()
}));

const mockGenerateNewDistinctPalette = vi.mocked(generateNewDistinctPalette);

describe('usePalette', () => {
  const mockPalette: Color[] = [
    { hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 } },
    { hex: '#00FF00', rgb: { r: 0, g: 255, b: 0 } },
    { hex: '#0000FF', rgb: { r: 0, g: 0, b: 255 } },
    { hex: '#FFFF00', rgb: { r: 255, g: 255, b: 0 } },
    { hex: '#FF00FF', rgb: { r: 255, g: 0, b: 255 } }
  ];

  const mockNewPalette: Color[] = [
    { hex: '#800000', rgb: { r: 128, g: 0, b: 0 } },
    { hex: '#008000', rgb: { r: 0, g: 128, b: 0 } },
    { hex: '#000080', rgb: { r: 0, g: 0, b: 128 } },
    { hex: '#808000', rgb: { r: 128, g: 128, b: 0 } },
    { hex: '#800080', rgb: { r: 128, g: 0, b: 128 } }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should start with empty palette and not generating', () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      expect(result.current.palette).toEqual([]);
      expect(result.current.isGenerating).toBe(false);
      expect(result.current.hasPalette).toBe(false);
    });

    it('should automatically generate initial palette on mount', async () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      // Initially generating
      expect(result.current.isGenerating).toBe(true);

      // Wait for the async operation and delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.palette).toEqual(mockPalette);
      expect(result.current.isGenerating).toBe(false);
      expect(result.current.hasPalette).toBe(true);
      expect(mockGenerateNewDistinctPalette).toHaveBeenCalledWith(undefined);
    });
  });

  describe('generateNewPalette', () => {
    it('should generate a new palette', async () => {
      mockGenerateNewDistinctPalette
        .mockResolvedValueOnce(mockPalette)
        .mockResolvedValueOnce(mockNewPalette);

      const { result } = renderHook(() => usePalette());

      // Wait for initial generation
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.palette).toEqual(mockPalette);

      // Generate new palette
      await act(async () => {
        result.current.generateNewPalette();
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.palette).toEqual(mockNewPalette);
      expect(mockGenerateNewDistinctPalette).toHaveBeenCalledTimes(2);
      expect(mockGenerateNewDistinctPalette).toHaveBeenLastCalledWith(mockPalette);
    });

    it('should set isGenerating to true during generation', async () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      // Initial generation
      expect(result.current.isGenerating).toBe(true);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.isGenerating).toBe(false);

      // Manual generation
      act(() => {
        result.current.generateNewPalette();
      });

      expect(result.current.isGenerating).toBe(true);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.isGenerating).toBe(false);
    });

    it('should prevent multiple simultaneous generations', async () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      // Start first generation
      act(() => {
        result.current.generateNewPalette();
      });

      expect(result.current.isGenerating).toBe(true);

      // Try to start second generation while first is running
      act(() => {
        result.current.generateNewPalette();
      });

      // Should still only have called the mock twice (initial + first manual)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(mockGenerateNewDistinctPalette).toHaveBeenCalledTimes(2);
    });

    it('should handle generation errors and use fallback', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockGenerateNewDistinctPalette
        .mockResolvedValueOnce(mockPalette) // Initial success
        .mockRejectedValueOnce(new Error('Generation failed')) // First attempt fails
        .mockResolvedValueOnce(mockNewPalette); // Fallback succeeds

      const { result } = renderHook(() => usePalette());

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.palette).toEqual(mockPalette);

      // This should trigger error and fallback
      await act(async () => {
        result.current.generateNewPalette();
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.palette).toEqual(mockNewPalette);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to generate new palette:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should handle both primary and fallback generation failures', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockGenerateNewDistinctPalette
        .mockResolvedValueOnce(mockPalette) // Initial success
        .mockRejectedValueOnce(new Error('Generation failed')) // First attempt fails
        .mockRejectedValueOnce(new Error('Fallback failed')); // Fallback also fails

      const { result } = renderHook(() => usePalette());

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      const originalPalette = result.current.palette;

      await act(async () => {
        result.current.generateNewPalette();
        await vi.advanceTimersByTimeAsync(300);
      });

      // Should keep the original palette when both generation attempts fail
      expect(result.current.palette).toEqual(originalPalette);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearPalette', () => {
    it('should clear the current palette', async () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.palette).toEqual(mockPalette);
      expect(result.current.hasPalette).toBe(true);

      act(() => {
        result.current.clearPalette();
      });

      expect(result.current.palette).toEqual([]);
      expect(result.current.hasPalette).toBe(false);
    });

    it('should not clear palette while generating', async () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.palette).toEqual(mockPalette);

      // Start generation
      act(() => {
        result.current.generateNewPalette();
      });

      expect(result.current.isGenerating).toBe(true);

      // Try to clear while generating
      act(() => {
        result.current.clearPalette();
      });

      // Palette should not be cleared
      expect(result.current.palette).toEqual(mockPalette);

      // Complete generation
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });
    });
  });

  describe('hasPalette', () => {
    it('should return false for empty palette', () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      expect(result.current.hasPalette).toBe(false);
    });

    it('should return true for non-empty palette', async () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.hasPalette).toBe(true);
    });

    it('should return false after clearing palette', async () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      expect(result.current.hasPalette).toBe(true);

      act(() => {
        result.current.clearPalette();
      });

      expect(result.current.hasPalette).toBe(false);
    });
  });

  describe('Timing and Delays', () => {
    it('should include a 300ms delay for better UX', async () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      expect(result.current.isGenerating).toBe(true);

      // Advance less than 300ms - should still be generating
      await act(async () => {
        await vi.advanceTimersByTimeAsync(200);
      });

      expect(result.current.isGenerating).toBe(true);

      // Complete the 300ms delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });

      expect(result.current.isGenerating).toBe(false);
      expect(result.current.palette).toEqual(mockPalette);
    });
  });

  describe('Hook Dependencies', () => {
    it('should not cause infinite re-renders', async () => {
      mockGenerateNewDistinctPalette.mockResolvedValue(mockPalette);

      const { result } = renderHook(() => usePalette());

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      const generateFn = result.current.generateNewPalette;
      const clearFn = result.current.clearPalette;

      // Re-render the hook
      const { result: result2 } = renderHook(() => usePalette());

      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });

      // Functions should be stable (referentially equal)
      expect(result.current.generateNewPalette).toBe(generateFn);
      expect(result.current.clearPalette).toBe(clearFn);
    });
  });
});