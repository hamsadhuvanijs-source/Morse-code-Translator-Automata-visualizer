"""
Thompson's Construction Algorithm
Converts Regular Expression (AST) to Non-deterministic Finite Automaton (NFA)
"""

from typing import Set, Dict, List, Tuple
from app.automata.regex_parser import RegexNode, NodeType


class NFAState:
    """State in an NFA"""
    _counter = 0
    
    def __init__(self, name: str = None):
        if name is None:
            name = f"q{NFAState._counter}"
            NFAState._counter += 1
        self.name = name
        self.transitions: Dict[str, Set['NFAState']] = {}
        self.epsilon_transitions: Set['NFAState'] = set()
    
    def add_transition(self, symbol: str, target: 'NFAState'):
        """Add a symbol transition"""
        if symbol not in self.transitions:
            self.transitions[symbol] = set()
        self.transitions[symbol].add(target)
    
    def add_epsilon(self, target: 'NFAState'):
        """Add an epsilon transition"""
        self.epsilon_transitions.add(target)
    
    def __repr__(self):
        return f"State({self.name})"
    
    def __hash__(self):
        return hash(self.name)
    
    def __eq__(self, other):
        return isinstance(other, NFAState) and self.name == other.name


class NFA:
    """Non-deterministic Finite Automaton"""
    
    def __init__(self, start: NFAState, accept: NFAState, states: Set[NFAState] = None):
        self.start = start
        self.accept = accept
        self.states = states or {start, accept}
        self.alphabet = set()
    
    def get_all_states(self) -> List[NFAState]:
        """Get all reachable states"""
        visited = set()
        stack = [self.start]
        
        while stack:
            state = stack.pop()
            if state in visited:
                continue
            visited.add(state)
            
            # Add states from transitions
            for symbol, targets in state.transitions.items():
                self.alphabet.add(symbol)
                for target in targets:
                    if target not in visited:
                        stack.append(target)
            
            # Add states from epsilon transitions
            for target in state.epsilon_transitions:
                if target not in visited:
                    stack.append(target)
        
        return list(visited)
    
    def to_dict(self) -> dict:
        """Convert NFA to dictionary representation"""
        all_states = self.get_all_states()
        
        transitions = {}
        for state in all_states:
            state_trans = {}
            
            # Regular transitions
            for symbol, targets in state.transitions.items():
                state_trans[symbol] = [t.name for t in targets]
            
            # Epsilon transitions
            if state.epsilon_transitions:
                state_trans['ε'] = [t.name for t in state.epsilon_transitions]
            
            transitions[state.name] = state_trans
        
        return {
            "type": "NFA",
            "alphabet": sorted(list(self.alphabet)),
            "states": [s.name for s in all_states],
            "start_state": self.start.name,
            "final_states": [self.accept.name],
            "transitions": transitions
        }


def thompson_construction(regex_ast: RegexNode) -> NFA:
    """
    Thompson's Construction Algorithm
    Converts regex AST to NFA
    
    Args:
        regex_ast: Root node of regex AST
        
    Returns:
        NFA representing the regex
    """
    return _thompson_recursive(regex_ast)


def _thompson_recursive(node: RegexNode) -> NFA:
    """Recursive helper for Thompson's construction"""
    
    if node.type == NodeType.EPSILON:
        # Create NFA for epsilon
        start = NFAState()
        accept = NFAState()
        start.add_epsilon(accept)
        return NFA(start, accept)
    
    elif node.type == NodeType.SYMBOL:
        # Create NFA for single symbol
        start = NFAState()
        accept = NFAState()
        start.add_transition(node.value, accept)
        return NFA(start, accept)
    
    elif node.type == NodeType.CONCAT:
        # Concatenation: NFA1 · NFA2
        nfa1 = _thompson_recursive(node.left)
        nfa2 = _thompson_recursive(node.right)
        
        # Connect accept of NFA1 to start of NFA2 with epsilon
        nfa1.accept.add_epsilon(nfa2.start)
        
        # Combined states
        combined_states = nfa1.states | nfa2.states
        return NFA(nfa1.start, nfa2.accept, combined_states)
    
    elif node.type == NodeType.UNION:
        # Union: NFA1 | NFA2
        nfa1 = _thompson_recursive(node.left)
        nfa2 = _thompson_recursive(node.right)
        
        # Create new start and accept states
        start = NFAState()
        accept = NFAState()
        
        # Epsilon from new start to both NFA starts
        start.add_epsilon(nfa1.start)
        start.add_epsilon(nfa2.start)
        
        # Epsilon from both NFA accepts to new accept
        nfa1.accept.add_epsilon(accept)
        nfa2.accept.add_epsilon(accept)
        
        # Combined states
        combined_states = {start, accept} | nfa1.states | nfa2.states
        return NFA(start, accept, combined_states)
    
    elif node.type == NodeType.STAR:
        # Kleene star: NFA*
        nfa = _thompson_recursive(node.left)
        
        # Create new start and accept states
        start = NFAState()
        accept = NFAState()
        
        # Epsilon transitions for star
        start.add_epsilon(nfa.start)  # Enter the NFA
        start.add_epsilon(accept)      # Skip the NFA (zero repetitions)
        nfa.accept.add_epsilon(nfa.start)  # Loop back
        nfa.accept.add_epsilon(accept)     # Exit
        
        # Combined states
        combined_states = {start, accept} | nfa.states
        return NFA(start, accept, combined_states)
    
    else:
        raise ValueError(f"Unknown node type: {node.type}")


def epsilon_closure(states: Set[NFAState]) -> Set[NFAState]:
    """
    Compute epsilon closure of a set of states
    
    Args:
        states: Set of NFA states
        
    Returns:
        Set of all states reachable via epsilon transitions
    """
    closure = set(states)
    stack = list(states)
    
    while stack:
        state = stack.pop()
        for epsilon_target in state.epsilon_transitions:
            if epsilon_target not in closure:
                closure.add(epsilon_target)
                stack.append(epsilon_target)
    
    return closure


def move(states: Set[NFAState], symbol: str) -> Set[NFAState]:
    """
    Compute the set of states reachable from given states on a symbol
    
    Args:
        states: Set of NFA states
        symbol: Input symbol
        
    Returns:
        Set of states reachable via the symbol
    """
    result = set()
    for state in states:
        if symbol in state.transitions:
            result.update(state.transitions[symbol])
    return result
