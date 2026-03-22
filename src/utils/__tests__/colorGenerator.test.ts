import {
  generateRandomColor,
  isValidHexColor,
  generateDistinctColorPalette,
  generateColorPalette,
  arePalettesDifferent,
  generateNewDistinctPalette,
  Color
} from '../colorGenerator';

describe('colorGenerator', () => {
  describe('generateRandomColor', () => {
    it('should generate a valid color object', () => {
      const color = generateRandomColor();

      expect(color).toHaveProperty('hex');
      expect(color).toHaveProperty('rgb');
      expect(color.rgb).toHaveProperty('r');
      expect(color.rgb).toHaveProperty('g');
      expect(color.rgb).toHaveProperty('b');
    });

    it('should generate hex color in correct format', () => {
      const color = generateRandomColor();

      expect(color.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(isValidHexColor(color.hex)).toBe(true);
    });

    it('should generate RGB values in valid range', () => {
      const color = generateRandomColor();
      const { r, g, b } = color.rgb;

      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(255);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(255);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(255);
    });

    it('should generate different colors on multiple calls', () => {
      const colors = Array.from({ length: 10 }, () => generateRandomColor());
      const hexCodes = colors.map(c => c.hex);
      const uniqueHexCodes = new Set(hexCodes);

      // It's possible but extremely unlikely to get duplicates
      expect(uniqueHexCodes.size).toBeGreaterThan(7);
    });
  });

  describe('isValidHexColor', () => {
    it('should validate correct hex colors', () => {
      expect(isValidHexColor('#000000')).toBe(true);
      expect(isValidHexColor('#FFFFFF')).toBe(true);
      expect(isValidHexColor('#ff5733')).toBe(true);
      expect(isValidHexColor('#ABC123')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('000000')).toBe(false); // No #
      expect(isValidHexColor('#00000')).toBe(false); // Too short
      expect(isValidHexColor('#0000000')).toBe(false); // Too long
      expect(isValidHexColor('#GGGGGG')).toBe(false); // Invalid chars
      expect(isValidHexColor('')).toBe(false); // Empty
      expect(isValidHexColor('#')).toBe(false); // Just #
    });
  });

  describe('generateDistinctColorPalette', () => {
    it('should generate the requested number of colors', () => {
      const palette = generateDistinctColorPalette(5);
      expect(palette).toHaveLength(5);
    });

    it('should generate all valid hex colors', () => {
      const palette = generateDistinctColorPalette(3);
      palette.forEach(color => {
        expect(isValidHexColor(color.hex)).toBe(true);
      });
    });

    it('should throw error for invalid count', () => {
      expect(() => generateDistinctColorPalette(0)).toThrow('Count must be positive');
      expect(() => generateDistinctColorPalette(-1)).toThrow('Count must be positive');
    });

    it('should generate distinct colors', () => {
      const palette = generateDistinctColorPalette(5, 50);
      const hexCodes = palette.map(c => c.hex);
      const uniqueHexCodes = new Set(hexCodes);

      expect(uniqueHexCodes.size).toBe(palette.length);
    });

    it('should handle large palettes', () => {
      const palette = generateDistinctColorPalette(20, 30);
      expect(palette).toHaveLength(20);

      const hexCodes = palette.map(c => c.hex);
      const uniqueHexCodes = new Set(hexCodes);
      expect(uniqueHexCodes.size).toBe(20);
    });
  });

  describe('generateColorPalette', () => {
    it('should generate exactly 5 colors', () => {
      const palette = generateColorPalette();
      expect(palette).toHaveLength(5);
    });

    it('should generate all valid colors', () => {
      const palette = generateColorPalette();
      palette.forEach(color => {
        expect(isValidHexColor(color.hex)).toBe(true);
        expect(color.rgb.r).toBeGreaterThanOrEqual(0);
        expect(color.rgb.r).toBeLessThanOrEqual(255);
        expect(color.rgb.g).toBeGreaterThanOrEqual(0);
        expect(color.rgb.g).toBeLessThanOrEqual(255);
        expect(color.rgb.b).toBeGreaterThanOrEqual(0);
        expect(color.rgb.b).toBeLessThanOrEqual(255);
      });
    });
  });

  describe('arePalettesDifferent', () => {
    const palette1: Color[] = [
      { hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 } },
      { hex: '#00FF00', rgb: { r: 0, g: 255, b: 0 } }
    ];

    const palette2: Color[] = [
      { hex: '#0000FF', rgb: { r: 0, g: 0, b: 255 } },
      { hex: '#FFFF00', rgb: { r: 255, g: 255, b: 0 } }
    ];

    const palette3: Color[] = [
      { hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 } },
      { hex: '#00FF00', rgb: { r: 0, g: 255, b: 0 } }
    ];

    it('should return true for completely different palettes', () => {
      expect(arePalettesDifferent(palette1, palette2)).toBe(true);
    });

    it('should return false for identical palettes', () => {
      expect(arePalettesDifferent(palette1, palette3)).toBe(false);
    });

    it('should return true for different length palettes', () => {
      const shortPalette = [palette1[0]];
      expect(arePalettesDifferent(palette1, shortPalette)).toBe(true);
    });

    it('should handle empty palettes', () => {
      expect(arePalettesDifferent([], [])).toBe(false);
      expect(arePalettesDifferent(palette1, [])).toBe(true);
      expect(arePalettesDifferent([], palette1)).toBe(true);
    });
  });

  describe('generateNewDistinctPalette', () => {
    it('should generate a palette different from current when provided', () => {
      const currentPalette = generateColorPalette();
      const newPalette = generateNewDistinctPalette(currentPalette);

      expect(newPalette).toHaveLength(5);
      expect(arePalettesDifferent(currentPalette, newPalette)).toBe(true);
    });

    it('should generate a palette when no current palette provided', () => {
      const newPalette = generateNewDistinctPalette();

      expect(newPalette).toHaveLength(5);
      newPalette.forEach(color => {
        expect(isValidHexColor(color.hex)).toBe(true);
      });
    });

    it('should eventually generate different palettes with retry logic', () => {
      // Create a very specific palette that's easy to avoid
      const currentPalette: Color[] = [
        { hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
        { hex: '#111111', rgb: { r: 17, g: 17, b: 17 } },
        { hex: '#222222', rgb: { r: 34, g: 34, b: 34 } },
        { hex: '#333333', rgb: { r: 51, g: 51, b: 51 } },
        { hex: '#444444', rgb: { r: 68, g: 68, b: 68 } }
      ];

      const newPalette = generateNewDistinctPalette(currentPalette);

      expect(arePalettesDifferent(currentPalette, newPalette)).toBe(true);
    });
  });
});