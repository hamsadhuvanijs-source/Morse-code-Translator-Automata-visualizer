import React, { useEffect, useRef } from 'react'
import AutomataGraph from './AutomataGraph'

function VisualizerPanel({ automaton, showNFA, currentStep, executionSteps }) {
  return (
    <div className="panel min-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {showNFA ? '🔷 NFA Visualization' : '🔶 DFA Visualization'}
        </h3>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
            title="Export as SVG"
          >
            💾 Export SVG
          </button>
          <button
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
            title="Zoom to fit"
          >
            🔍 Fit
          </button>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 min-h-[500px] relative">
        {automaton ? (
          <AutomataGraph
            automaton={automaton}
            showNFA={showNFA}
            currentStep={currentStep}
            executionSteps={executionSteps}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <div className="text-6xl mb-4">📡</div>
            <p className="text-lg font-medium">Enter Morse code to visualize automaton</p>
            <p className="text-sm mt-2">State diagrams will appear here</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900 rounded">
          <div className="w-4 h-4 rounded-full bg-blue-600"></div>
          <span className="text-blue-900 dark:text-blue-100">Start State</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900 rounded">
          <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
          <span className="text-yellow-900 dark:text-yellow-100">Active State</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900 rounded">
          <div className="w-4 h-4 rounded-full border-4 border-green-600"></div>
          <span className="text-green-900 dark:text-green-100">Accept State</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900 rounded">
          <div className="w-4 h-4 rounded-full bg-red-600"></div>
          <span className="text-red-900 dark:text-red-100">Error/Reject</span>
        </div>
      </div>

      {/* Current Step Info */}
      {executionSteps && executionSteps.length > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Step {currentStep + 1} of {executionSteps.length}
            </span>
            {executionSteps[currentStep] && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Symbol: <code className="font-bold text-blue-600 dark:text-blue-400">{executionSteps[currentStep].symbol}</code>
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {executionSteps[currentStep].from} → {executionSteps[currentStep].to}
                </span>
              </div>
            )}
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / executionSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VisualizerPanel
