"""
Subset Construction Algorithm
Converts Non-deterministic Finite Automaton (NFA) to Deterministic Finite Automaton (DFA)
"""

from typing import Set, Dict, List, FrozenSet
from app.automata.thompson import NFA, NFAState, epsilon_closure, move


class DFAState:
    """State in a DFA"""
    _counter = 0
    
    def __init__(self, nfa_states: FrozenSet[NFAState], name: str = None):
        self.nfa_states = nfa_states  # Set of NFA states this DFA state represents
        if name is None:
            name = f"d{DFAState._counter}"
            DFAState._counter += 1
        self.name = name
        self.transitions: Dict[str, 'DFAState'] = {}
        self.is_final = False
    
    def add_transition(self, symbol: str, target: 'DFAState'):
        """Add a transition"""
        self.transitions[symbol] = target
    
    def __repr__(self):
        nfa_names = ','.join(sorted([s.name for s in self.nfa_states]))
        return f"DFAState({self.name}=[{nfa_names}])"
    
    def __hash__(self):
        return hash(self.nfa_states)
    
    def __eq__(self, other):
        return isinstance(other, DFAState) and self.nfa_states == other.nfa_states


class DFA:
    """Deterministic Finite Automaton"""
    
    def __init__(self, start: DFAState, states: Set[DFAState], alphabet: Set[str], finals: Set[DFAState]):
        self.start = start
        self.states = states
        self.alphabet = alphabet
        self.finals = finals
    
    def accepts(self, input_string: str) -> bool:
        """
        Check if DFA accepts an input string
        
        Args:
            input_string: String to test
            
        Returns:
            True if accepted, False otherwise
        """
        current = self.start
        
        for symbol in input_string:
            if symbol not in current.transitions:
                return False
            current = current.transitions[symbol]
        
        return current in self.finals
    
    def trace_execution(self, input_string: str) -> List[Dict]:
        """
        Trace DFA execution step by step
        
        Args:
            input_string: String to process
            
        Returns:
            List of step dictionaries with from, to, symbol
        """
        current = self.start
        steps = []
        
        for i, symbol in enumerate(input_string):
            if symbol not in current.transitions:
                steps.append({
                    "symbol": symbol,
                    "from": current.name,
                    "to": "REJECT",
                    "active_states": [current.name],
                    "position": i,
                    "error": f"No transition for '{symbol}'"
                })
                return steps
            
            next_state = current.transitions[symbol]
            steps.append({
                "symbol": symbol,
                "from": current.name,
                "to": next_state.name,
                "active_states": [next_state.name],
                "position": i
            })
            current = next_state
        
        # Final acceptance check
        accepted = current in self.finals
        steps.append({
            "symbol": "END",
            "from": current.name,
            "to": current.name,
            "active_states": [current.name],
            "accepted": accepted,
            "is_final": accepted
        })
        
        return steps
    
    def to_dict(self) -> dict:
        """Convert DFA to dictionary representation"""
        transitions = {}
        for state in self.states:
            state_trans = {}
            for symbol, target in state.transitions.items():
                state_trans[symbol] = target.name
            transitions[state.name] = state_trans
        
        return {
            "type": "DFA",
            "alphabet": sorted(list(self.alphabet)),
            "states": [s.name for s in self.states],
            "start_state": self.start.name,
            "final_states": [s.name for s in self.finals],
            "transitions": transitions
        }


def subset_construction(nfa: NFA) -> DFA:
    """
    Subset Construction (Powerset Construction)
    Converts NFA to equivalent DFA
    
    Args:
        nfa: Non-deterministic Finite Automaton
        
    Returns:
        Equivalent Deterministic Finite Automaton
    """
    # Get all states and alphabet
    nfa.get_all_states()  # Populate alphabet
    alphabet = nfa.alphabet
    
    # Initial DFA state: epsilon-closure of NFA start state
    start_closure = epsilon_closure({nfa.start})
    start_dfa_state = DFAState(frozenset(start_closure))
    
    # Track DFA states
    dfa_states: Dict[FrozenSet[NFAState], DFAState] = {
        frozenset(start_closure): start_dfa_state
    }
    
    # Worklist of DFA states to process
    unprocessed = [start_dfa_state]
    
    # Process each DFA state
    while unprocessed:
        current_dfa = unprocessed.pop()
        current_nfa_states = set(current_dfa.nfa_states)
        
        # For each symbol in alphabet
        for symbol in alphabet:
            # Compute move and epsilon-closure
            next_nfa_states = move(current_nfa_states, symbol)
            next_closure = epsilon_closure(next_nfa_states)
            
            if not next_closure:
                continue  # No transition for this symbol
            
            # Create or get DFA state for this closure
            frozen_closure = frozenset(next_closure)
            
            if frozen_closure not in dfa_states:
                # Create new DFA state
                new_dfa_state = DFAState(frozen_closure)
                dfa_states[frozen_closure] = new_dfa_state
                unprocessed.append(new_dfa_state)
            
            # Add transition
            target_dfa = dfa_states[frozen_closure]
            current_dfa.add_transition(symbol, target_dfa)
    
    # Determine final states: any DFA state containing NFA accept state
    final_dfa_states = set()
    for dfa_state in dfa_states.values():
        if nfa.accept in dfa_state.nfa_states:
            dfa_state.is_final = True
            final_dfa_states.add(dfa_state)
    
    return DFA(
        start=start_dfa_state,
        states=set(dfa_states.values()),
        alphabet=alphabet,
        finals=final_dfa_states
    )


def minimize_dfa(dfa: DFA) -> DFA:
    """
    Minimize DFA using partition refinement (Hopcroft's algorithm)
    Optional optimization - can be implemented for completeness
    
    Args:
        dfa: DFA to minimize
        
    Returns:
        Minimized DFA
    """
    # For now, return the same DFA
    # Full implementation would use partition refinement
    return dfa
