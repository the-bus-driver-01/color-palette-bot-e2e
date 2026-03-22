/**
 * Utility functions for generating random colors and color palettes
 */

export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

/**
 * Generates a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Converts RGB values to hex string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts hex string to RGB object
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Calculates the Euclidean distance between two colors in RGB space
 */
function colorDistance(color1: Color, color2: Color): number {
  const { r: r1, g: g1, b: b1 } = color1.rgb;
  const { r: r2, g: g2, b: b2 } = color2.rgb;

  return Math.sqrt(
    Math.pow(r2 - r1, 2) +
    Math.pow(g2 - g1, 2) +
    Math.pow(b2 - b1, 2)
  );
}

/**
 * Generates a single random hex color
 */
export function generateRandomColor(): Color {
  const r = randomInt(0, 255);
  const g = randomInt(0, 255);
  const b = randomInt(0, 255);
  const hex = rgbToHex(r, g, b);

  return {
    hex,
    rgb: { r, g, b }
  };
}

/**
 * Validates if a string is a valid 6-character hex color
 */
export function isValidHexColor(hex: string): boolean {
  const hexPattern = /^#[0-9a-fA-F]{6}$/;
  return hexPattern.test(hex);
}

/**
 * Generates a palette of N distinct colors with adequate visual separation
 */
export function generateDistinctColorPalette(count: number, minDistance: number = 80): Color[] {
  if (count <= 0) {
    throw new Error('Count must be positive');
  }

  const colors: Color[] = [];
  const maxAttempts = 1000; // Prevent infinite loops

  // Generate the first color
  colors.push(generateRandomColor());

  // Generate remaining colors with distance constraints
  for (let i = 1; i < count; i++) {
    let attempts = 0;
    let newColor: Color;
    let isDistinct: boolean;

    do {
      newColor = generateRandomColor();
      isDistinct = colors.every(existingColor =>
        colorDistance(newColor, existingColor) >= minDistance
      );
      attempts++;

      // If we can't find a distinct color after many attempts, reduce the distance requirement
      if (attempts > maxAttempts / 2 && minDistance > 40) {
        minDistance = Math.max(40, minDistance - 10);
      }

    } while (!isDistinct && attempts < maxAttempts);

    colors.push(newColor);
  }

  return colors;
}

/**
 * Generates a palette of 5 distinct colors (default for the app)
 */
export function generateColorPalette(): Color[] {
  return generateDistinctColorPalette(5);
}

/**
 * Checks if two palettes are completely different (no shared colors)
 */
export function arePalettesDifferent(palette1: Color[], palette2: Color[]): boolean {
  if (palette1.length !== palette2.length) {
    return true;
  }

  return palette1.every(color1 =>
    palette2.every(color2 => color1.hex !== color2.hex)
  );
}

/**
 * Generates a new palette that is guaranteed to be different from the current one
 */
export function generateNewDistinctPalette(currentPalette?: Color[]): Color[] {
  let newPalette: Color[];
  let attempts = 0;
  const maxAttempts = 10;

  do {
    newPalette = generateColorPalette();
    attempts++;
  } while (
    currentPalette &&
    !arePalettesDifferent(newPalette, currentPalette) &&
    attempts < maxAttempts
  );

  return newPalette;
}