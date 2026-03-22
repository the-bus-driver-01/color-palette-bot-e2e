import { useState, useCallback, useEffect } from 'react';
import { Color, generateNewDistinctPalette } from '../utils/colorGenerator';
import { UsePaletteReturn } from '../types/color';

/**
 * Custom hook for managing color palette state and generation
 *
 * Features:
 * - Manages current palette state
 * - Provides generation functionality that ensures distinct colors
 * - Includes loading state for better UX
 * - Automatically generates initial palette on mount
 * - Ensures each generation produces completely new colors
 */
export function usePalette(): UsePaletteReturn {
  const [palette, setPalette] = useState<Color[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generates a new palette that is guaranteed to be different from the current one
   */
  const generateNewPalette = useCallback(async () => {
    if (isGenerating) {
      return; // Prevent multiple simultaneous generations
    }

    setIsGenerating(true);

    // Add a small delay to show the loading state (for better UX)
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const newPalette = generateNewDistinctPalette(palette.length > 0 ? palette : undefined);
      setPalette(newPalette);
    } catch (error) {
      console.error('Failed to generate new palette:', error);
      // Fallback: try to generate without the current palette constraint
      try {
        const fallbackPalette = generateNewDistinctPalette();
        setPalette(fallbackPalette);
      } catch (fallbackError) {
        console.error('Failed to generate fallback palette:', fallbackError);
        // This should rarely happen, but we'll keep the current palette if it does
      }
    } finally {
      setIsGenerating(false);
    }
  }, [palette, isGenerating]);

  /**
   * Clears the current palette
   */
  const clearPalette = useCallback(() => {
    if (!isGenerating) {
      setPalette([]);
    }
  }, [isGenerating]);

  /**
   * Generate initial palette on component mount
   */
  useEffect(() => {
    if (palette.length === 0 && !isGenerating) {
      generateNewPalette();
    }
  }, [generateNewPalette, palette.length, isGenerating]);

  const hasPalette = palette.length > 0;

  return {
    palette,
    isGenerating,
    generateNewPalette,
    clearPalette,
    hasPalette
  };
}

export default usePalette;