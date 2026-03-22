import '@testing-library/jest-dom'

// Add vitest globals if they don't exist
if (typeof global.vi === 'undefined') {
  // This will be available in vitest environment
  // @ts-ignore
  global.vi = typeof vi !== 'undefined' ? vi : undefined;
}