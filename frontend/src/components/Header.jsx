import React from 'react'

function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">📡</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Morse Code Automata Visualizer
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interactive Formal Languages & Automata Theory Education
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
