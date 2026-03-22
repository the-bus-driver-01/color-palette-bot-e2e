import React from 'react';
import { Color } from '../utils/colorGenerator';
import { ColorPaletteProps, ColorSwatchProps } from '../types/color';
import './ColorPalette.css';

/**
 * Individual color swatch component
 */

function ColorSwatch({ color, index }: ColorSwatchProps) {
  const { hex, rgb } = color;

  // Calculate luminance to determine text color (dark or light)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textColor = luminance > 0.5 ? '#000000' : '#ffffff';

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      // You could add a toast notification here in a real app
      console.log(`Copied ${hex} to clipboard`);
    } catch (err) {
      console.error('Failed to copy color to clipboard:', err);
    }
  };

  return (
    <div
      className="color-swatch"
      style={{ backgroundColor: hex }}
      onClick={handleCopyToClipboard}
      role="button"
      tabIndex={0}
      aria-label={`Color ${index + 1}: ${hex}. Click to copy to clipboard.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopyToClipboard();
        }
      }}
    >
      <div className="color-info">
        <div
          className="color-hex"
          style={{ color: textColor }}
        >
          {hex}
        </div>
        <div
          className="color-rgb"
          style={{ color: textColor, opacity: 0.8 }}
        >
          rgb({rgb.r}, {rgb.g}, {rgb.b})
        </div>
      </div>
    </div>
  );
}

/**
 * ColorPalette component that displays an array of colors as swatches
 */
export function ColorPalette({ colors }: ColorPaletteProps) {
  if (!colors || colors.length === 0) {
    return (
      <div className="color-palette empty">
        <p className="empty-message">No colors to display</p>
      </div>
    );
  }

  return (
    <div className="color-palette" role="region" aria-label="Color palette">
      <div className="palette-grid">
        {colors.map((color, index) => (
          <ColorSwatch
            key={`${color.hex}-${index}`}
            color={color}
            index={index}
          />
        ))}
      </div>
      <div className="palette-info">
        <p className="palette-hint">
          Click any color to copy its hex code to clipboard
        </p>
      </div>
    </div>
  );
}

export default ColorPalette;