import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

function AutomataGraph({ automaton, showNFA, currentStep, executionSteps }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!automaton || !svgRef.current) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()

    // Get data - handle both structures
    let data
    if (showNFA && automaton.nfa) {
      data = automaton.nfa
    } else if (automaton.dfa) {
      data = automaton.dfa
    } else if (automaton.states) {
      // Already in the right format
      data = automaton
    } else {
      console.error('No valid automaton data', automaton)
      return
    }

    console.log('Rendering automaton:', data)
    renderGraph(data)
  }, [automaton, showNFA])

  useEffect(() => {
    if (!executionSteps || executionSteps.length === 0) return
    highlightCurrentStep()
  }, [currentStep, executionSteps])

  const renderGraph = (data) => {
    if (!data || !data.states || data.states.length === 0) {
      console.error('Invalid automaton data:', data)
      return
    }

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    console.log('States:', data.states)
    console.log('Transitions:', data.transitions)

    // Ensure states are named q0, q1, q2, etc.
    const stateMapping = {}
    const sortedStates = [...data.states].sort()
    
    // Start state is always q0
    stateMapping[data.start_state] = 'q0'
    let counter = 1
    sortedStates.forEach(state => {
      if (state !== data.start_state) {
        stateMapping[state] = `q${counter}`
        counter++
      }
    })

    // Create nodes
    const nodes = data.states.map((state, index) => ({
      id: state,
      displayId: stateMapping[state],
      isStart: state === data.start_state,
      isFinal: data.final_states && data.final_states.includes(state),
      index: index
    }))

    // Ensure nodes are arranged in order
    nodes.sort((a, b) => {
      const orderA = parseInt(a.displayId.replace('q', ''), 10);
      const orderB = parseInt(b.displayId.replace('q', ''), 10);
      return orderA - orderB;
    });

    // Update positions after sorting
    const nodeSpacing = Math.max(140, (width - 200) / Math.max(nodes.length - 1, 1));
    const startX = 100;
    nodes.forEach((node, i) => {
      node.x = startX + (i * nodeSpacing);
      node.y = height / 2;
      node.fx = node.x; // Fix x position
      node.fy = node.y; // Fix y position
    });

    console.log('Nodes:', nodes)

    // Create links from transitions
    const links = []
    if (data.transitions) {
      Object.entries(data.transitions).forEach(([from, trans]) => {
        if (trans && typeof trans === 'object') {
          Object.entries(trans).forEach(([symbol, to]) => {
            if (to) {
              const targets = Array.isArray(to) ? to : [to]
              targets.forEach(target => {
                // Display morse code symbols (dots and dashes) clearly
                let displaySymbol = symbol
                if (symbol === '.') displaySymbol = '\u2022'  // Use bullet for dot
                if (symbol === '-') displaySymbol = '\u2013'  // Use en-dash for dash
                
                links.push({
                  source: from,
                  target: target,
                  label: displaySymbol,
                  originalSymbol: symbol
                })
              })
            }
          })
        }
      })
    }

    console.log('Links:', links)

    // Setup SVG
    const g = svg.append('g')

    // Add zoom
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })
    svg.call(zoom)

    // Improve layout to avoid overlapping states and transitions
    const startXPos = 100
    const nodeYPos = height / 2

    nodes.forEach((node, i) => {
      node.x = startXPos + (i * nodeSpacing)
      node.y = nodeYPos
      node.fx = node.x  // Fix x position
      node.fy = node.y  // Fix y position
    })

    // Add proper arrow markers and labels for transitions
    const defs = svg.append('defs')
    
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 35)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#64748b')
    
    defs.append('marker')
      .attr('id', 'arrowhead-active')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 35)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#22c55e')

    defs.append('marker')
      .attr('id', 'start-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#1f2937')

    // Draw edges
    const linkGroup = g.append('g').attr('class', 'links')
    const linkElements = linkGroup.selectAll('g')
      .data(links)
      .join('g')
      .attr('class', 'automata-edge')

    // Edge paths with better routing
    linkElements.append('path')
      .attr('class', 'edge-path')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrowhead)')
      .attr('d', d => {
        const sourceNode = nodes.find(n => n.id === d.source)
        const targetNode = nodes.find(n => n.id === d.target)
        
        if (!sourceNode || !targetNode) return ''
        
        // Self loop
        if (d.source === d.target) {
          return `M${sourceNode.x - 20},${sourceNode.y - 30} 
                  A25,25 0 1,1 ${sourceNode.x + 20},${sourceNode.y - 30}`
        }
        
        // Calculate proper arrow positioning
        const dx = targetNode.x - sourceNode.x
        const dy = targetNode.y - sourceNode.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const unitX = dx / distance
        const unitY = dy / distance
        
        const startX = sourceNode.x + (unitX * 30)
        const startY = sourceNode.y + (unitY * 30)
        const endX = targetNode.x - (unitX * 30)
        const endY = targetNode.y - (unitY * 30)
        
        return `M${startX},${startY} L${endX},${endY}`
      })

    // Edge labels with better styling
    linkElements.append('rect')
      .attr('class', 'edge-label-bg')
      .attr('fill', 'white')
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 1)
      .attr('rx', 6)
      .attr('ry', 6)

    linkElements.append('text')
      .attr('class', 'edge-label')
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('fill', '#dc2626')
      .attr('font-family', 'monospace')
      .text(d => d.label)
      .attr('x', d => {
        const sourceNode = nodes.find(n => n.id === d.source)
        const targetNode = nodes.find(n => n.id === d.target)
        if (!sourceNode || !targetNode) return 0
        if (d.source === d.target) return sourceNode.x
        return (sourceNode.x + targetNode.x) / 2
      })
      .attr('y', d => {
        const sourceNode = nodes.find(n => n.id === d.source)
        const targetNode = nodes.find(n => n.id === d.target)
        if (!sourceNode || !targetNode) return 0
        if (d.source === d.target) return sourceNode.y - 45
        return (sourceNode.y + targetNode.y) / 2 - 15
      })
      .each(function(d) {
        const bbox = this.getBBox()
        d3.select(this.parentNode).select('.edge-label-bg')
          .attr('x', bbox.x - 6)
          .attr('y', bbox.y - 3)
          .attr('width', bbox.width + 12)
          .attr('height', bbox.height + 6)
      })

    // Draw nodes with better styling
    const nodeGroup = g.append('g').attr('class', 'nodes')
    const nodeElements = nodeGroup.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'automata-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)

    // Main circle with gradient
    nodeElements.append('circle')
      .attr('r', 28)
      .attr('fill', '#fbbf24')
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2.5)

    // Double circle for final states
    nodeElements.filter(d => d.isFinal)
      .append('circle')
      .attr('r', 22)
      .attr('fill', 'none')
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2.5)

    // State labels with better typography
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 6)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .attr('font-family', 'sans-serif')
      .text(d => d.displayId)

    // Start arrow with better positioning
    const startNodes = nodeElements.filter(d => d.isStart)
    
    startNodes.append('path')
      .attr('d', 'M-65,0 L-33,0')
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2.5)
      .attr('marker-end', 'url(#start-arrow)')

    // Ensure the graph auto-fits within the available space
    setTimeout(() => {
      const bounds = g.node().getBBox()
      if (bounds.width > 0 && bounds.height > 0) {
        const padding = 50
        const scale = Math.min(
          (width - padding) / bounds.width,
          (height - padding) / bounds.height,
          1
        )
        const centerX = width / 2
        const centerY = height / 2
        const boundsCenterX = bounds.x + bounds.width / 2
        const boundsCenterY = bounds.y + bounds.height / 2
        
        const translateX = centerX - boundsCenterX * scale
        const translateY = centerY - boundsCenterY * scale
        
        svg.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale))
      }
    }, 300) // Increased timeout duration to slow down animation
  }

  const highlightCurrentStep = () => {
    const svg = d3.select(svgRef.current)
    if (!executionSteps || currentStep >= executionSteps.length) return

    const step = executionSteps[currentStep]

    // Reset all highlights
    svg.selectAll('.automata-node circle')
      .filter((d, i, nodes) => d3.select(nodes[i]).attr('r') > 25)
      .attr('fill', '#fbbf24')
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2.5)

    svg.selectAll('.edge-path')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')

    // Highlight active state
    if (step.to && step.to !== 'REJECT') {
      svg.selectAll('.automata-node')
        .filter(d => d.id === step.to)
        .select('circle')
        .filter((d, i, nodes) => d3.select(nodes[i]).attr('r') > 25)
        .attr('fill', '#22c55e')
        .attr('stroke', '#15803d')
        .attr('stroke-width', 3)
    }

    // Highlight transition
    if (step.from && step.to && step.to !== 'REJECT') {
      svg.selectAll('.automata-edge')
        .filter(d => d.source === step.from && d.target === step.to && d.originalSymbol === step.symbol)
        .select('.edge-path')
        .attr('stroke', '#22c55e')
        .attr('stroke-width', 3)
        .attr('marker-end', 'url(#arrowhead-active)')
    }
  }

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    />
  )
}

export default AutomataGraph
