/**
 * Utility functions for automata visualization
 */

/**
 * Calculate positions for nodes in a circular layout
 */
export function circularLayout(nodes, width, height) {
  const radius = Math.min(width, height) / 3
  const centerX = width / 2
  const centerY = height / 2
  const angleStep = (2 * Math.PI) / nodes.length

  return nodes.map((node, index) => ({
    ...node,
    x: centerX + radius * Math.cos(index * angleStep - Math.PI / 2),
    y: centerY + radius * Math.sin(index * angleStep - Math.PI / 2),
  }))
}

/**
 * Calculate positions for nodes in a hierarchical layout
 */
export function hierarchicalLayout(nodes, edges, width, height) {
  // Simple layered layout
  const layers = {}
  const visited = new Set()
  
  // BFS to assign layers
  function assignLayer(nodeId, layer) {
    if (visited.has(nodeId)) return
    visited.add(nodeId)
    
    if (!layers[layer]) layers[layer] = []
    layers[layer].push(nodeId)
    
    // Find outgoing edges
    edges.forEach(edge => {
      if (edge.source === nodeId) {
        assignLayer(edge.target, layer + 1)
      }
    })
  }
  
  // Start from the first node (usually start state)
  if (nodes.length > 0) {
    assignLayer(nodes[0].id, 0)
  }
  
  // Position nodes
  const layerCount = Object.keys(layers).length
  const layerHeight = height / (layerCount + 1)
  
  return nodes.map(node => {
    let layer = 0
    for (const [l, ids] of Object.entries(layers)) {
      if (ids.includes(node.id)) {
        layer = parseInt(l)
        break
      }
    }
    
    const nodesInLayer = layers[layer].length
    const index = layers[layer].indexOf(node.id)
    const layerWidth = width / (nodesInLayer + 1)
    
    return {
      ...node,
      x: layerWidth * (index + 1),
      y: layerHeight * (layer + 1),
    }
  })
}

/**
 * Validate Morse code input
 */
export function validateMorse(input) {
  const validChars = /^[.\-\s\/]*$/
  if (!validChars.test(input)) {
    return {
      valid: false,
      error: 'Invalid characters. Use only dots (.), dashes (-), spaces, and /',
    }
  }
  return { valid: true }
}

/**
 * Format execution step for display
 */
export function formatStep(step, index) {
  if (!step) return null
  
  return {
    index,
    symbol: step.symbol,
    from: step.from,
    to: step.to,
    description: `Read '${step.symbol}' → Transition from ${step.from} to ${step.to}`,
    accepted: step.accepted,
    error: step.error,
  }
}

/**
 * Export SVG to file
 */
export function exportSVG(svgElement, filename = 'automaton.svg') {
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const blob = new Blob([svgData], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export SVG to PNG
 */
export function exportPNG(svgElement, filename = 'automaton.png') {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const svgData = new XMLSerializer().serializeToString(svgElement)
  
  const img = new Image()
  const blob = new Blob([svgData], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    
    canvas.toBlob(blob => {
      const pngUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = pngUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(pngUrl)
      URL.revokeObjectURL(url)
    })
  }
  
  img.src = url
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
