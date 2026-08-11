import React, { useState, useEffect } from 'react'
import InputPanel from './InputPanel'
import VisualizerPanel from './VisualizerPanel'
import DetailsPanel from './DetailsPanel'
import { automatonAPI } from '../services/api'

function MainApp() {
  const [morseInput, setMorseInput] = useState('')
  const [decodedOutput, setDecodedOutput] = useState('')
  const [currentAutomaton, setCurrentAutomaton] = useState(null)
  const [executionSteps, setExecutionSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showNFA, setShowNFA] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [allLetters, setAllLetters] = useState([])
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDecode = async (morse) => {
    setMorseInput(morse)
    setLoading(true)
    setError(null)
    
    try {
      // Parse the Morse input
      const result = await automatonAPI.parseMorseInput({
        morse_input: morse,
        mode: 'per_letter'
      })
      
      console.log('Decode result:', result)
      
      // Set decoded output IMMEDIATELY - this is the fix!
      if (result.decoded) {
        setDecodedOutput(result.decoded)
      } else {
        setDecodedOutput('No output')
      }
      
      // Store all letters
      setAllLetters(result.letters || [])
      
      // If there are letters, show the first one
      if (result.letters && result.letters.length > 0) {
        const firstLetter = result.letters[0]
        
        // Use the automaton from the parse response directly
        if (firstLetter.automaton) {
          const automatonData = {
            nfa: firstLetter.automaton,
            dfa: firstLetter.automaton,
            letter: firstLetter.letter,
            morse: firstLetter.morse,
            regex: firstLetter.automaton.metadata?.regex || '',
            execution_steps: firstLetter.steps || []
          }
          
          setCurrentAutomaton(automatonData)
          setExecutionSteps(firstLetter.steps || [])
          setCurrentStep(0)
          setCurrentLetterIndex(0)
        } else {
          // Fallback: build automaton
          const automatonResult = await automatonAPI.buildLetterAutomaton({
            morse: firstLetter.morse
          })
          
          setCurrentAutomaton(automatonResult)
          setExecutionSteps(automatonResult.execution_steps || firstLetter.steps || [])
          setCurrentStep(0)
          setCurrentLetterIndex(0)
        }
      } else {
        // No valid letters found
        setDecodedOutput('Invalid morse code')
        setCurrentAutomaton(null)
        setExecutionSteps([])
      }
    } catch (err) {
      setError(err.message || 'Failed to decode Morse code')
      setDecodedOutput('Error: ' + (err.message || 'Unknown error'))
      console.error('Decoding error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStep = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (currentLetterIndex < allLetters.length - 1) {
      // Move to next letter
      loadLetter(currentLetterIndex + 1)
    }
  }

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    if (allLetters.length > 0) {
      loadLetter(0)
    }
  }

  const loadLetter = async (index) => {
    if (index < 0 || index >= allLetters.length) return
    
    const letter = allLetters[index]
    setCurrentLetterIndex(index)
    
    try {
      // Use automaton from parse response if available
      if (letter.automaton) {
        const automatonData = {
          nfa: letter.automaton,
          dfa: letter.automaton,
          letter: letter.letter,
          morse: letter.morse,
          regex: letter.automaton.metadata?.regex || '',
          execution_steps: letter.steps || []
        }
        
        setCurrentAutomaton(automatonData)
        setExecutionSteps(letter.steps || [])
        setCurrentStep(0)
      } else {
        // Fallback: build new automaton
        const automatonResult = await automatonAPI.buildLetterAutomaton({
          morse: letter.morse
        })
        
        setCurrentAutomaton(automatonResult)
        setExecutionSteps(automatonResult.execution_steps || letter.steps || [])
        setCurrentStep(0)
      }
    } catch (err) {
      console.error('Error loading letter:', err)
    }
  }

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying) return
    
    const timer = setTimeout(() => {
      if (currentStep < executionSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else if (currentLetterIndex < allLetters.length - 1) {
        loadLetter(currentLetterIndex + 1)
      } else {
        setIsPlaying(false) // End of all letters
      }
    }, animationSpeed)
    
    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, executionSteps, currentLetterIndex, allLetters, animationSpeed])

  return (
    <div>
      {/* Loading/Error States */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-800 dark:text-blue-200 text-center">
          <div className="animate-pulse">🔄 Processing Morse code...</div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 rounded-lg text-red-800 dark:text-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Current Letter Indicator */}
      {allLetters.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Processing Letter: {currentLetterIndex + 1} of {allLetters.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadLetter(currentLetterIndex - 1)}
                disabled={currentLetterIndex === 0}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded text-sm"
              >
                ← Prev
              </button>
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {allLetters[currentLetterIndex]?.letter}
              </span>
              <button
                onClick={() => loadLetter(currentLetterIndex + 1)}
                disabled={currentLetterIndex === allLetters.length - 1}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Panel - Input & Controls */}
        <div className="lg:col-span-3">
          <InputPanel
            onDecode={handleDecode}
            onStep={handleStep}
            onPlay={handlePlay}
            onReset={handleReset}
            isPlaying={isPlaying}
            showNFA={showNFA}
            onToggleNFA={() => setShowNFA(!showNFA)}
            animationSpeed={animationSpeed}
            onSpeedChange={setAnimationSpeed}
            loading={loading}
          />
        </div>

        {/* Center Panel - Visualizer */}
        <div className="lg:col-span-6">
          <VisualizerPanel
            automaton={currentAutomaton}
            showNFA={showNFA}
            currentStep={currentStep}
            executionSteps={executionSteps}
          />
        </div>

        {/* Right Panel - Details & Output */}
        <div className="lg:col-span-3">
          <DetailsPanel
            decodedOutput={decodedOutput}
            executionSteps={executionSteps}
            currentStep={currentStep}
            currentAutomaton={currentAutomaton}
            allLetters={allLetters}
          />
        </div>
      </div>
    </div>
  )
}

export default MainApp
