import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ColorPalette } from '../ColorPalette';
import { Color } from '../../utils/colorGenerator';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

describe('ColorPalette', () => {
  const mockColors: Color[] = [
    { hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 } },
    { hex: '#00FF00', rgb: { r: 0, g: 255, b: 0 } },
    { hex: '#0000FF', rgb: { r: 0, g: 0, b: 255 } },
    { hex: '#FFFF00', rgb: { r: 255, g: 255, b: 0 } },
    { hex: '#FF00FF', rgb: { r: 255, g: 0, b: 255 } }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all colors in the palette', () => {
      render(<ColorPalette colors={mockColors} />);

      mockColors.forEach(color => {
        expect(screen.getByText(color.hex)).toBeInTheDocument();
        expect(screen.getByText(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)).toBeInTheDocument();
      });
    });

    it('should render empty state when no colors provided', () => {
      render(<ColorPalette colors={[]} />);

      expect(screen.getByText('No colors to display')).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Color palette' })).toHaveClass('empty');
    });

    it('should render empty state when colors is undefined', () => {
      render(<ColorPalette colors={undefined as any} />);

      expect(screen.getByText('No colors to display')).toBeInTheDocument();
    });

    it('should render the palette hint', () => {
      render(<ColorPalette colors={mockColors} />);

      expect(screen.getByText('Click any color to copy its hex code to clipboard')).toBeInTheDocument();
    });
  });

  describe('Color Swatches', () => {
    it('should render each color swatch with correct background color', () => {
      render(<ColorPalette colors={mockColors} />);

      mockColors.forEach((color, index) => {
        const swatch = screen.getByLabelText(`Color ${index + 1}: ${color.hex}. Click to copy to clipboard.`);
        expect(swatch).toHaveStyle(`background-color: ${color.hex}`);
      });
    });

    it('should display hex and RGB values for each color', () => {
      render(<ColorPalette colors={mockColors} />);

      mockColors.forEach(color => {
        expect(screen.getByText(color.hex)).toBeInTheDocument();
        expect(screen.getByText(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)).toBeInTheDocument();
      });
    });

    it('should apply correct text color based on luminance', () => {
      const lightColor: Color = { hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } };
      const darkColor: Color = { hex: '#000000', rgb: { r: 0, g: 0, b: 0 } };

      render(<ColorPalette colors={[lightColor, darkColor]} />);

      const lightColorHex = screen.getByText('#FFFFFF');
      const darkColorHex = screen.getByText('#000000');

      expect(lightColorHex).toHaveStyle('color: #000000');
      expect(darkColorHex).toHaveStyle('color: #ffffff');
    });
  });

  describe('Clipboard Functionality', () => {
    it('should copy hex code to clipboard when swatch is clicked', async () => {
      const user = userEvent.setup();
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

      render(<ColorPalette colors={mockColors} />);

      const firstSwatch = screen.getByLabelText(`Color 1: ${mockColors[0].hex}. Click to copy to clipboard.`);
      await user.click(firstSwatch);

      expect(writeTextSpy).toHaveBeenCalledWith(mockColors[0].hex);
    });

    it('should handle clipboard API errors gracefully', async () => {
      const user = userEvent.setup();
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText')
        .mockRejectedValue(new Error('Clipboard access denied'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<ColorPalette colors={mockColors} />);

      const firstSwatch = screen.getByLabelText(`Color 1: ${mockColors[0].hex}. Click to copy to clipboard.`);
      await user.click(firstSwatch);

      expect(writeTextSpy).toHaveBeenCalledWith(mockColors[0].hex);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy color to clipboard:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should copy when Enter key is pressed on swatch', async () => {
      const user = userEvent.setup();
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

      render(<ColorPalette colors={mockColors} />);

      const firstSwatch = screen.getByLabelText(`Color 1: ${mockColors[0].hex}. Click to copy to clipboard.`);
      firstSwatch.focus();
      await user.keyboard('{Enter}');

      expect(writeTextSpy).toHaveBeenCalledWith(mockColors[0].hex);
    });

    it('should copy when Space key is pressed on swatch', async () => {
      const user = userEvent.setup();
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

      render(<ColorPalette colors={mockColors} />);

      const firstSwatch = screen.getByLabelText(`Color 1: ${mockColors[0].hex}. Click to copy to clipboard.`);
      firstSwatch.focus();
      await user.keyboard(' ');

      expect(writeTextSpy).toHaveBeenCalledWith(mockColors[0].hex);
    });

    it('should not copy on other key presses', async () => {
      const user = userEvent.setup();
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

      render(<ColorPalette colors={mockColors} />);

      const firstSwatch = screen.getByLabelText(`Color 1: ${mockColors[0].hex}. Click to copy to clipboard.`);
      firstSwatch.focus();
      await user.keyboard('a');
      await user.keyboard('{Escape}');

      expect(writeTextSpy).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ColorPalette colors={mockColors} />);

      expect(screen.getByRole('region', { name: 'Color palette' })).toBeInTheDocument();

      mockColors.forEach((color, index) => {
        const swatch = screen.getByLabelText(`Color ${index + 1}: ${color.hex}. Click to copy to clipboard.`);
        expect(swatch).toHaveAttribute('role', 'button');
        expect(swatch).toHaveAttribute('tabIndex', '0');
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<ColorPalette colors={mockColors.slice(0, 3)} />);

      const swatches = screen.getAllByRole('button');

      // Tab through swatches
      await user.tab();
      expect(swatches[0]).toHaveFocus();

      await user.tab();
      expect(swatches[1]).toHaveFocus();

      await user.tab();
      expect(swatches[2]).toHaveFocus();
    });

    it('should prevent default behavior on space key to avoid page scrolling', () => {
      render(<ColorPalette colors={mockColors} />);

      const swatch = screen.getByLabelText(`Color 1: ${mockColors[0].hex}. Click to copy to clipboard.`);
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent.keyDown(swatch, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Visual Behavior', () => {
    it('should have unique keys for each color swatch', () => {
      const { container } = render(<ColorPalette colors={mockColors} />);

      const swatches = container.querySelectorAll('.color-swatch');
      expect(swatches).toHaveLength(mockColors.length);

      // Each swatch should have the color data
      swatches.forEach((swatch, index) => {
        expect(swatch).toHaveStyle(`background-color: ${mockColors[index].hex}`);
      });
    });

    it('should handle duplicate colors gracefully', () => {
      const duplicateColors: Color[] = [
        mockColors[0],
        mockColors[0], // duplicate
        mockColors[1]
      ];

      render(<ColorPalette colors={duplicateColors} />);

      // Should render all colors, even duplicates
      const swatches = screen.getAllByRole('button');
      expect(swatches).toHaveLength(3);
    });

    it('should handle single color palette', () => {
      const singleColor = [mockColors[0]];

      render(<ColorPalette colors={singleColor} />);

      expect(screen.getByText(singleColor[0].hex)).toBeInTheDocument();
      expect(screen.getByLabelText(`Color 1: ${singleColor[0].hex}. Click to copy to clipboard.`)).toBeInTheDocument();
    });
  });

  describe('Console Logging', () => {
    it('should log successful copy operations', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      render(<ColorPalette colors={mockColors} />);

      const firstSwatch = screen.getByLabelText(`Color 1: ${mockColors[0].hex}. Click to copy to clipboard.`);
      await user.click(firstSwatch);

      expect(consoleSpy).toHaveBeenCalledWith(`Copied ${mockColors[0].hex} to clipboard`);

      consoleSpy.mockRestore();
    });
  });
});