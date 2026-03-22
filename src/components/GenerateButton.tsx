import React from 'react';
import { GenerateButtonProps } from '../types/color';
import './GenerateButton.css';

/**
 * Generate Button component for triggering palette generation
 * Includes proper accessibility features and visual feedback
 */
export function GenerateButton({
  onClick,
  isGenerating = false,
  disabled = false,
  className = ''
}: GenerateButtonProps) {
  const handleClick = () => {
    if (!disabled && !isGenerating) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const buttonClassName = [
    'generate-button',
    isGenerating ? 'generating' : '',
    disabled ? 'disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || isGenerating}
      aria-label={
        isGenerating
          ? 'Generating new color palette...'
          : 'Generate new color palette'
      }
      aria-describedby="generate-button-description"
    >
      <span className="button-content">
        {isGenerating && (
          <span className="loading-spinner" aria-hidden="true">
            <svg
              className="spinner-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
              />
            </svg>
          </span>
        )}
        <span className="button-text">
          {isGenerating ? 'Generating...' : 'Generate Palette'}
        </span>
        {!isGenerating && (
          <span className="button-icon" aria-hidden="true">
            <svg
              className="generate-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </span>
      <div
        id="generate-button-description"
        className="sr-only"
      >
        Click to generate a new set of 5 random colors
      </div>
    </button>
  );
}

export default GenerateButton;