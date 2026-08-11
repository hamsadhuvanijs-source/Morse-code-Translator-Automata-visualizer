import React, { useState } from 'react'

const SAMPLE_INPUTS = [
  { label: 'SOS', morse: '... --- ...' },
  { label: 'HELLO', morse: '.... . .-.. .-.. ---' },
  { label: 'MORSE', morse: '-- --- .-. ... .' },
  { label: 'ABC', morse: '.- -... -.-.' },
]

function InputPanel({ onDecode, onStep, onPlay, onReset, isPlaying, showNFA, onToggleNFA, animationSpeed, onSpeedChange, loading }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onDecode(input)
    }
  }

  const handleSampleClick = (morse) => {
    setInput(morse)
  }

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div className="panel">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📝 Input Morse Code
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Morse Code Pattern
            </label>
            <textarea
              className="input-field min-h-[100px] font-mono"
              placeholder="Enter dots (.) and dashes (-)&#10;Space between letters&#10;/ between words&#10;&#10;Example: ... --- ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Processing...' : '🔍 Decode & Visualize'}
          </button>
        </form>

        {/* Sample Templates */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quick Samples:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_INPUTS.map((sample) => (
              <button
                key={sample.label}
                onClick={() => handleSampleClick(sample.morse)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="panel">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          ⏯️ Animation Controls
        </h3>

        <div className="space-y-3">
          {/* Playback buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={onStep}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition-colors"
              title="Step Forward"
            >
              ⏭️ Step
            </button>
            <button
              onClick={onPlay}
              className={`px-3 py-2 ${isPlaying ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded font-semibold text-sm transition-colors`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            <button
              onClick={onReset}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm transition-colors"
              title="Reset"
            >
              🔄 Reset
            </button>
          </div>

          {/* Speed slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Animation Speed: {(2000 - animationSpeed) / 10}%
            </label>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={2000 - animationSpeed}
              onChange={(e) => onSpeedChange(2000 - parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Toggle switches */}
          <div className="space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show NFA
              </span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={showNFA}
                  onChange={onToggleNFA}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
            
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
              {showNFA ? '📊 Showing: Non-deterministic Finite Automaton (NFA)' : '📊 Showing: Deterministic Finite Automaton (DFA)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputPanel
