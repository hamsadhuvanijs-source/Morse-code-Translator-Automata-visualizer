import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Morse Code API Service
 */
export const morseAPI = {
  /**
   * Get Morse code mapping table
   */
  async getMorseTable() {
    const response = await api.get('/api/morse/table')
    return response.data
  },

  /**
   * Encode text to Morse code
   */
  async encodeText(text) {
    const response = await api.get(`/api/morse/encode/${encodeURIComponent(text)}`)
    return response.data
  },

  /**
   * Decode Morse code to text
   */
  async decodeMorse(morse) {
    const response = await api.get(`/api/morse/decode/${encodeURIComponent(morse)}`)
    return response.data
  },
}

/**
 * Automaton API Service
 */
export const automatonAPI = {
  /**
   * Build automaton for a single letter
   * @param {Object} payload - { letter: 'A' } or { morse: '.-' }
   */
  async buildLetterAutomaton(payload) {
    const response = await api.post('/api/automaton/letter', payload)
    return response.data
  },

  /**
   * Parse full Morse input and get step-by-step execution
   * @param {Object} payload - { morse_input: '... --- ...', mode: 'per_letter' }
   */
  async parseMorseInput(payload) {
    const response = await api.post('/api/automaton/parse', payload)
    return response.data
  },

  /**
   * Get combined automaton (for reference)
   */
  async getCombinedAutomaton() {
    const response = await api.get('/api/automaton/combined')
    return response.data
  },
}

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await api.get('/api/health')
  return response.data
}

export default {
  morseAPI,
  automatonAPI,
  healthCheck,
}
