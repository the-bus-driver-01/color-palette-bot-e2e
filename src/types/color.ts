/**
 * TypeScript type definitions and interfaces for color-related data structures
 */

/**
 * Represents a color with both hex and RGB representations
 */
export interface Color {
  /** Hex color code (e.g., "#FF5733") */
  hex: string;
  /** RGB color values */
  rgb: {
    /** Red component (0-255) */
    r: number;
    /** Green component (0-255) */
    g: number;
    /** Blue component (0-255) */
    b: number;
  };
}

/**
 * Type for a collection of colors forming a palette
 */
export type Palette = Color[];

/**
 * Props for the ColorPalette component
 */
export interface ColorPaletteProps {
  /** Array of colors to display */
  colors: Color[];
  /** Optional CSS class name */
  className?: string;
  /** Optional callback when a color is clicked */
  onColorClick?: (color: Color, index: number) => void;
  /** Optional callback when a color is copied */
  onColorCopy?: (color: Color, index: number) => void;
}

/**
 * Props for the ColorSwatch component
 */
export interface ColorSwatchProps {
  /** The color to display */
  color: Color;
  /** Index of the color in the palette */
  index: number;
  /** Optional CSS class name */
  className?: string;
  /** Optional callback when the swatch is clicked */
  onClick?: () => void;
  /** Optional callback when the color is copied */
  onCopy?: () => void;
}

/**
 * Props for the GenerateButton component
 */
export interface GenerateButtonProps {
  /** Callback function to execute when button is clicked */
  onClick: () => void;
  /** Whether the button is currently generating */
  isGenerating?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional CSS class name */
  className?: string;
  /** Optional button text override */
  children?: React.ReactNode;
}

/**
 * Return type for the usePalette hook
 */
export interface UsePaletteReturn {
  /** Current color palette */
  palette: Color[];
  /** Whether a new palette is being generated */
  isGenerating: boolean;
  /** Generates a new palette of distinct colors */
  generateNewPalette: () => void;
  /** Clears the current palette */
  clearPalette: () => void;
  /** Whether there is a current palette */
  hasPalette: boolean;
}

/**
 * Configuration options for color generation
 */
export interface ColorGenerationOptions {
  /** Number of colors to generate */
  count?: number;
  /** Minimum distance between colors for distinctness */
  minDistance?: number;
  /** Maximum attempts to find distinct colors */
  maxAttempts?: number;
  /** Whether to ensure no duplicate colors */
  ensureDistinct?: boolean;
}

/**
 * Options for palette generation
 */
export interface PaletteGenerationOptions extends ColorGenerationOptions {
  /** Current palette to avoid duplicating */
  currentPalette?: Color[];
  /** Whether to force completely new colors */
  forceNew?: boolean;
}

/**
 * Color format types
 */
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv';

/**
 * RGB color values as tuple
 */
export type RGBTuple = [number, number, number];

/**
 * HSL color values
 */
export interface HSLColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
}

/**
 * HSV color values
 */
export interface HSVColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  v: number; // Value (0-100)
}

/**
 * Utility type for color conversion functions
 */
export type ColorConverter<T> = (color: Color) => T;

/**
 * Utility type for color validation functions
 */
export type ColorValidator = (color: string | Color) => boolean;

/**
 * Error types for color operations
 */
export class ColorError extends Error {
  constructor(message: string, public readonly colorValue?: string) {
    super(message);
    this.name = 'ColorError';
  }
}

export class PaletteError extends Error {
  constructor(message: string, public readonly palette?: Color[]) {
    super(message);
    this.name = 'PaletteError';
  }
}

/**
 * Event handler types for color-related interactions
 */
export type ColorClickHandler = (color: Color, index: number, event: React.MouseEvent) => void;
export type ColorKeyHandler = (color: Color, index: number, event: React.KeyboardEvent) => void;
export type PaletteChangeHandler = (newPalette: Color[], oldPalette?: Color[]) => void;