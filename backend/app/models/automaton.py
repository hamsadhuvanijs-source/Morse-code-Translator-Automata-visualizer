"""
Automaton data models
Defines structure for NFA, DFA, and automaton responses
"""

from typing import Dict, List, Set, Optional, Any
from pydantic import BaseModel, Field


class Automaton(BaseModel):
    """Base automaton model"""
    type: str = Field(..., description="Type of automaton: NFA or DFA")
    alphabet: List[str] = Field(..., description="Input alphabet symbols")
    states: List[str] = Field(..., description="List of state identifiers")
    start_state: str = Field(..., description="Initial state")
    final_states: List[str] = Field(..., description="Accepting states")
    transitions: Dict[str, Dict[str, Any]] = Field(..., description="State transitions")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional information")


class NFA(Automaton):
    """Non-deterministic Finite Automaton"""
    type: str = "NFA"
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "NFA",
                "alphabet": [".", "-"],
                "states": ["q0", "q1", "q2"],
                "start_state": "q0",
                "final_states": ["q2"],
                "transitions": {
                    "q0": {".": ["q1"], "epsilon": []},
                    "q1": {"-": ["q2"], "epsilon": []},
                    "q2": {}
                },
                "metadata": {
                    "letter": "A",
                    "regex": ".-",
                    "morse": ".-"
                }
            }
        }


class DFA(Automaton):
    """Deterministic Finite Automaton"""
    type: str = "DFA"
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "DFA",
                "alphabet": [".", "-"],
                "states": ["q0", "q1", "q2", "q3"],
                "start_state": "q0",
                "final_states": ["q3"],
                "transitions": {
                    "q0": {".": "q1", "-": "q2"},
                    "q1": {".": "q3", "-": "q2"},
                    "q2": {".": "q2", "-": "q3"},
                    "q3": {}
                },
                "metadata": {
                    "letter": "A",
                    "regex": ".-",
                    "morse": ".-",
                    "explanation": "dot then dash"
                }
            }
        }


class StepLog(BaseModel):
    """Single step in automaton execution"""
    symbol: str = Field(..., description="Input symbol processed")
    from_state: str = Field(..., description="Source state", alias="from")
    to_state: str = Field(..., description="Target state", alias="to")
    active_states: List[str] = Field(..., description="Currently active states (for NFA)")
    
    class Config:
        populate_by_name = True


class AutomatonResponse(BaseModel):
    """Response containing automaton data"""
    letter: Optional[str] = Field(None, description="English letter")
    morse: str = Field(..., description="Morse code pattern")
    regex: str = Field(..., description="Regular expression")
    nfa: NFA = Field(..., description="Non-deterministic finite automaton")
    dfa: DFA = Field(..., description="Deterministic finite automaton")
    explanation: Optional[str] = Field(None, description="Human-readable explanation")
