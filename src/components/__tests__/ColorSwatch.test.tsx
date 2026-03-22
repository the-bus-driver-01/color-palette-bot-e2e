import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ColorSwatch } from '../ColorSwatch';
import { Color } from '../../utils/colorGenerator';

// Mock the clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(void 0),
};
Object.assign(navigator, {
  clipboard: mockClipboard,
});

// Mock console.log and console.error
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

const mockColor: Color = {
  hex: '#FF5733',
  rgb: { r: 255, g: 87, b: 51 }
};

describe('ColorSwatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  it('renders color swatch with correct background color', () => {
    render(<ColorSwatch color={mockColor} index={0} />);

    const swatch = screen.getByRole('button');
    expect(swatch).toHaveStyle({ backgroundColor: '#FF5733' });
  });

  it('displays hex and RGB values', () => {
    render(<ColorSwatch color={mockColor} index={0} />);

    expect(screen.getByText('#FF5733')).toBeInTheDocument();
    expect(screen.getByText('rgb(255, 87, 51)')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<ColorSwatch color={mockColor} index={0} />);

    const swatch = screen.getByRole('button');
    expect(swatch).toHaveAttribute('aria-label', 'Color 1: #FF5733. Click to copy to clipboard.');
    expect(swatch).toHaveAttribute('tabIndex', '0');
  });

  it('copies hex color to clipboard when clicked', async () => {
    render(<ColorSwatch color={mockColor} index={0} />);

    const swatch = screen.getByRole('button');
    fireEvent.click(swatch);

    expect(mockClipboard.writeText).toHaveBeenCalledWith('#FF5733');
    expect(mockConsoleLog).toHaveBeenCalledWith('Copied #FF5733 to clipboard');
  });

  it('copies hex color to clipboard when Enter key is pressed', async () => {
    render(<ColorSwatch color={mockColor} index={0} />);

    const swatch = screen.getByRole('button');
    fireEvent.keyDown(swatch, { key: 'Enter', preventDefault: vi.fn() });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('#FF5733');
  });

  it('copies hex color to clipboard when Space key is pressed', async () => {
    render(<ColorSwatch color={mockColor} index={0} />);

    const swatch = screen.getByRole('button');
    fireEvent.keyDown(swatch, { key: ' ', preventDefault: vi.fn() });

    expect(mockClipboard.writeText).toHaveBeenCalledWith('#FF5733');
  });

  it('does not trigger copy on other key presses', () => {
    render(<ColorSwatch color={mockColor} index={0} />);

    const swatch = screen.getByRole('button');
    fireEvent.keyDown(swatch, { key: 'a' });

    expect(mockClipboard.writeText).not.toHaveBeenCalled();
  });

  it('handles clipboard write failure gracefully', async () => {
    mockClipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));

    render(<ColorSwatch color={mockColor} index={0} />);

    const swatch = screen.getByRole('button');
    fireEvent.click(swatch);

    expect(mockConsoleError).toHaveBeenCalledWith('Failed to copy color to clipboard:', expect.any(Error));
  });

  it('calculates correct text color for light background', () => {
    const lightColor: Color = {
      hex: '#FFFFFF',
      rgb: { r: 255, g: 255, b: 255 }
    };

    render(<ColorSwatch color={lightColor} index={0} />);

    const hexElement = screen.getByText('#FFFFFF');
    const rgbElement = screen.getByText('rgb(255, 255, 255)');

    expect(hexElement).toHaveStyle({ color: '#000000' });
    expect(rgbElement).toHaveStyle({ color: '#000000' });
  });

  it('calculates correct text color for dark background', () => {
    const darkColor: Color = {
      hex: '#000000',
      rgb: { r: 0, g: 0, b: 0 }
    };

    render(<ColorSwatch color={darkColor} index={0} />);

    const hexElement = screen.getByText('#000000');
    const rgbElement = screen.getByText('rgb(0, 0, 0)');

    expect(hexElement).toHaveStyle({ color: '#ffffff' });
    expect(rgbElement).toHaveStyle({ color: '#ffffff' });
  });

  it('prevents default behavior on key events', () => {
    render(<ColorSwatch color={mockColor} index={0} />);

    const swatch = screen.getByRole('button');
    const mockPreventDefault = vi.fn();

    fireEvent.keyDown(swatch, {
      key: 'Enter',
      preventDefault: mockPreventDefault
    });

    expect(mockPreventDefault).toHaveBeenCalled();
  });
});