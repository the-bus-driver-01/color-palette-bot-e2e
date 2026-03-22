import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center items-center gap-4 mb-8">
            <a href="https://vitejs.dev" target="_blank" className="hover:opacity-80 transition-opacity">
              <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" className="hover:opacity-80 transition-opacity">
              <img src={reactLogo} className="h-16 w-16 animate-spin" alt="React logo" />
            </a>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Vite + React + TypeScript
          </h1>

          <div className="space-y-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={() => setCount((count) => count + 1)}
            >
              count is {count}
            </button>

            <p className="text-gray-600 text-sm">
              Click the button to test React state updates
            </p>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                ✅ Tailwind CSS is working!
              </p>
              <p className="text-green-600 text-xs mt-1">
                This green box and all other styles are from Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App