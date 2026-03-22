import React from 'react'
import './App.css'
import { ColorPalette } from './components/ColorPalette'
import { GenerateButton } from './components/GenerateButton'
import { usePalette } from './hooks/usePalette'

function App() {
  const {
    palette,
    isGenerating,
    generateNewPalette,
    hasPalette
  } = usePalette()

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Random Color Palette Generator</h1>
        <p className="app-description">
          Generate beautiful, distinct color palettes with the click of a button.
          Perfect for designers, developers, and creative projects.
        </p>
      </header>

      <main className="app-main">
        <section className="generate-section">
          <GenerateButton
            onClick={generateNewPalette}
            isGenerating={isGenerating}
          />
          {!hasPalette && !isGenerating && (
            <p className="generate-hint">
              Click the button above to generate your first color palette!
            </p>
          )}
        </section>

        <section className="palette-section">
          {hasPalette && (
            <ColorPalette colors={palette} />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p className="footer-text">
          Built with React, TypeScript, and lots of ❤️
        </p>
      </footer>
    </div>
  )
}

export default App