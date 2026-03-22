import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenerateButton } from '../GenerateButton';

describe('GenerateButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Rendering', () => {
    it('should render with default text', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Generate Palette')).toBeInTheDocument();
    });

    it('should render with generating state', () => {
      render(<GenerateButton onClick={mockOnClick} isGenerating={true} />);

      expect(screen.getByText('Generating...')).toBeInTheDocument();
      expect(screen.getByLabelText('Generating new color palette...')).toBeInTheDocument();
    });

    it('should render as disabled', () => {
      render(<GenerateButton onClick={mockOnClick} disabled={true} />);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should apply custom className', () => {
      const customClass = 'custom-button-class';
      render(<GenerateButton onClick={mockOnClick} className={customClass} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('generate-button', customClass);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Generate new color palette');
      expect(button).toHaveAttribute('aria-describedby', 'generate-button-description');
    });

    it('should have proper ARIA attributes when generating', () => {
      render(<GenerateButton onClick={mockOnClick} isGenerating={true} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Generating new color palette...');
    });

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<GenerateButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      await user.tab();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockOnClick).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });

    it('should have screen reader text', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      expect(screen.getByText('Click to generate a new set of 5 random colors')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      render(<GenerateButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      render(<GenerateButton onClick={mockOnClick} disabled={true} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when generating', async () => {
      const user = userEvent.setup();
      render(<GenerateButton onClick={mockOnClick} isGenerating={true} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should handle Enter key press', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should handle Space key press', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: ' ' });

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not handle other key presses', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'a' });
      fireEvent.keyDown(button, { key: 'Escape' });
      fireEvent.keyDown(button, { key: 'Tab' });

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Visual States', () => {
    it('should show loading spinner when generating', () => {
      render(<GenerateButton onClick={mockOnClick} isGenerating={true} />);

      const spinner = screen.getByRole('button').querySelector('.loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('should show generate icon when not generating', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      const icon = screen.getByRole('button').querySelector('.button-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should have correct CSS classes for different states', () => {
      const { rerender } = render(<GenerateButton onClick={mockOnClick} />);
      let button = screen.getByRole('button');
      expect(button).toHaveClass('generate-button');
      expect(button).not.toHaveClass('generating', 'disabled');

      rerender(<GenerateButton onClick={mockOnClick} isGenerating={true} />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('generate-button', 'generating');

      rerender(<GenerateButton onClick={mockOnClick} disabled={true} />);
      button = screen.getByRole('button');
      expect(button).toHaveClass('generate-button', 'disabled');
    });
  });

  describe('Edge Cases', () => {
    it('should handle onClick being called multiple times rapidly', async () => {
      const user = userEvent.setup();
      render(<GenerateButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');

      // Simulate rapid clicking
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it('should prevent default behavior on space key', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent.keyDown(button, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default behavior on Enter key', () => {
      render(<GenerateButton onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent.keyDown(button, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});