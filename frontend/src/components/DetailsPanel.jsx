import React, { useState } from 'react'

function DetailsPanel({ decodedOutput, executionSteps, currentStep, currentAutomaton, allLetters }) {
  const [activeTab, setActiveTab] = useState('output')

  return (
    <div className="space-y-4">
      {/* Output Section */}
      <div className="panel">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          ✅ Decoded Output
        </h3>
        <div className="min-h-[80px] p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-lg border-2 border-green-300 dark:border-green-700">
          {decodedOutput && decodedOutput !== '' ? (
            <div className="text-3xl font-bold text-green-700 dark:text-green-300 text-center">
              {decodedOutput}
            </div>
          ) : (
            <div className="text-center text-gray-400 dark:text-gray-500">
              Enter morse code and click "Decode & Visualize"
            </div>
          )}
        </div>
      </div>

      {/* Tabs for Details */}
      <div className="panel">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <TabButton
            active={activeTab === 'output'}
            onClick={() => setActiveTab('output')}
            label="📋 Steps"
          />
          <TabButton
            active={activeTab === 'regex'}
            onClick={() => setActiveTab('regex')}
            label="🔬 Regex"
          />
          <TabButton
            active={activeTab === 'table'}
            onClick={() => setActiveTab('table')}
            label="📊 Table"
          />
          <TabButton
            active={activeTab === 'json'}
            onClick={() => setActiveTab('json')}
            label="💾 JSON"
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {activeTab === 'output' && (
            <StepLog steps={executionSteps} currentStep={currentStep} />
          )}
          {activeTab === 'regex' && (
            <RegexInfo automaton={currentAutomaton} />
          )}
          {activeTab === 'table' && (
            <TransitionTable automaton={currentAutomaton} />
          )}
          {activeTab === 'json' && (
            <JSONView automaton={currentAutomaton} />
          )}
        </div>
      </div>

      {/* Letters Breakdown */}
      {allLetters && allLetters.length > 0 && (
        <div className="panel">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            🔠 Letters Processed
          </h3>
          <div className="space-y-2">
            {allLetters.map((letter, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {letter.letter}
                </span>
                <code className="morse-code text-blue-600 dark:text-blue-400">
                  {letter.morse}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm transition-colors ${
        active
          ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  )
}

function StepLog({ steps, currentStep }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No execution steps yet. Decode some Morse code to see the process!
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border-2 transition-all ${
            index === currentStep
              ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900'
              : index < currentStep
              ? 'border-green-300 bg-green-50 dark:bg-green-900'
              : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Step {index + 1}
            </span>
            {step.accepted !== undefined && (
              <span
                className={`text-xs font-bold ${
                  step.accepted ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {step.accepted ? '✓ ACCEPTED' : '✗ REJECTED'}
              </span>
            )}
          </div>
          <div className="text-sm font-mono">
            {step.symbol !== 'END' && (
              <>
                Read: <code className="font-bold text-blue-600">{step.symbol}</code>
                {' → '}
                <span className="text-gray-600 dark:text-gray-400">
                  {step.from} → {step.to}
                </span>
              </>
            )}
            {step.symbol === 'END' && (
              <span className="font-semibold">End of input</span>
            )}
          </div>
          {step.error && (
            <div className="mt-1 text-xs text-red-600 dark:text-red-400">
              ⚠️ {step.error}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function RegexInfo({ automaton }) {
  if (!automaton || !automaton.regex) {
    return (
      <div className="text-center text-gray-400 py-8">
        Regex information will appear here
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Regular Expression:
        </div>
        <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded font-mono text-lg text-blue-600 dark:text-blue-400">
          {automaton.regex}
        </code>
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Morse Pattern:
        </div>
        <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded morse-code text-xl">
          {automaton.morse}
        </code>
      </div>
      {automaton.letter && (
        <div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Represents Letter:
          </div>
          <div className="text-4xl font-bold text-center text-green-600 dark:text-green-400 p-4 bg-gray-100 dark:bg-gray-700 rounded">
            {automaton.letter}
          </div>
        </div>
      )}
      <div className="text-xs text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900 rounded">
        This regex pattern represents the Morse code sequence. 
        Each dot (.) and dash (-) is a literal symbol in the alphabet.
      </div>
    </div>
  )
}

function TransitionTable({ automaton }) {
  if (!automaton || !automaton.dfa || !automaton.dfa.transitions) {
    return (
      <div className="text-center text-gray-400 py-8">
        Transition table will appear here
      </div>
    )
  }

  const dfa = automaton.dfa
  const alphabet = dfa.alphabet || ['.', '-']
  const states = dfa.states || []

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="border border-gray-300 dark:border-gray-600 p-2">State</th>
            {alphabet.map(symbol => (
              <th key={symbol} className="border border-gray-300 dark:border-gray-600 p-2">
                {symbol}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {states.map(state => (
            <tr key={state} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">
                {state}
                {state === dfa.start_state && ' (start)'}
                {dfa.final_states.includes(state) && ' ✓'}
              </td>
              {alphabet.map(symbol => (
                <td key={symbol} className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                  {dfa.transitions[state]?.[symbol] || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        ✓ = Final/Accepting state
      </div>
    </div>
  )
}

function JSONView({ automaton }) {
  if (!automaton) {
    return (
      <div className="text-center text-gray-400 py-8">
        JSON data will appear here
      </div>
    )
  }

  return (
    <div>
      <pre className="p-4 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto font-mono">
        {JSON.stringify(automaton, null, 2)}
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(automaton, null, 2))
        }}
        className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold"
      >
        📋 Copy to Clipboard
      </button>
    </div>
  )
}

export default DetailsPanel
