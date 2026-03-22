import React from 'react';
import { Color } from '../utils/colorGenerator';
import { ColorPaletteProps } from '../types/color';
import { ColorSwatch } from './ColorSwatch';
import './ColorPalette.css';

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