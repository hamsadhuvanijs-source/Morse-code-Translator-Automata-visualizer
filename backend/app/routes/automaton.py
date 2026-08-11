"""
Automaton routes
Endpoints for NFA/DFA generation and visualization
"""

from fastapi import APIRouter, HTTPException
from app.models.morse import LetterRequest, ParseRequest, MorseResponse, LetterStep
from app.models.automaton import AutomatonResponse, NFA as NFAModel, DFA as DFAModel
from app.automata.morse_table import MORSE_TABLE, REVERSE_MORSE_TABLE, get_morse, get_char
from app.automata.regex_parser import morse_to_regex, parse_regex
from app.automata.thompson import thompson_construction
from app.automata.subset_construction import subset_construction

router = APIRouter()


@router.post("/letter", response_model=AutomatonResponse)
async def build_letter_automaton(payload: LetterRequest):
    """
    Generate NFA and DFA for a single letter/character
    
    Args:
        payload: Letter request with either letter or morse code
        
    Returns:
        Automaton response with NFA, DFA, and metadata
    """
    # Determine morse code
    if payload.letter:
        morse = get_morse(payload.letter)
        if not morse:
            raise HTTPException(status_code=400, detail=f"Unknown character: {payload.letter}")
        letter = payload.letter.upper()
    elif payload.morse:
        morse = payload.morse
        letter = get_char(morse)
        if not letter:
            letter = None  # Unknown morse pattern
    else:
        raise HTTPException(status_code=400, detail="Must provide either 'letter' or 'morse'")
    
    # Build automata
    try:
        # Parse regex
        regex = morse_to_regex(morse)
        regex_ast = parse_regex(regex)
        
        # Thompson's construction: Regex -> NFA
        nfa = thompson_construction(regex_ast)
        nfa_dict = nfa.to_dict()
        nfa_dict["metadata"] = {
            "letter": letter,
            "morse": morse,
            "regex": regex
        }
        
        # Subset construction: NFA -> DFA
        dfa = subset_construction(nfa)
        dfa_dict = dfa.to_dict()
        dfa_dict["metadata"] = {
            "letter": letter,
            "morse": morse,
            "regex": regex,
            "explanation": f"Morse pattern: {morse}"
        }
        
        return AutomatonResponse(
            letter=letter,
            morse=morse,
            regex=regex,
            nfa=NFAModel(**nfa_dict),
            dfa=DFAModel(**dfa_dict),
            explanation=f"Automaton for '{letter}' ({morse})"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error building automaton: {str(e)}")


@router.post("/parse", response_model=MorseResponse)
async def parse_morse_input(payload: ParseRequest):
    """
    Parse full Morse code input and return step-by-step execution
    
    Args:
        payload: Parse request with morse input
        
    Returns:
        Morse response with decoded text and per-letter breakdown
    """
    morse_input = payload.morse_input.strip()
    mode = payload.mode
    
    # Split into words (separated by /)
    words = morse_input.split('/')
    
    decoded_words = []
    all_letters = []
    total_steps = 0
    
    for word in words:
        # Split into letters (separated by space)
        letter_patterns = [p.strip() for p in word.split() if p.strip()]
        
        for morse_pattern in letter_patterns:
            # Decode letter
            letter = get_char(morse_pattern)
            if not letter:
                letter = '?'  # Unknown pattern
            
            # Build automaton if requested
            automaton_data = None
            steps = []
            
            if mode == "per_letter":
                try:
                    # Build DFA for this letter
                    regex = morse_to_regex(morse_pattern)
                    regex_ast = parse_regex(regex)
                    nfa = thompson_construction(regex_ast)
                    dfa = subset_construction(nfa)
                    
                    # Trace execution
                    steps = dfa.trace_execution(morse_pattern)
                    total_steps += len(steps)
                    
                    # Get automaton dict
                    automaton_data = dfa.to_dict()
                    automaton_data["metadata"] = {
                        "letter": letter,
                        "morse": morse_pattern,
                        "regex": regex
                    }
                    
                except Exception as e:
                    steps = [{"error": str(e)}]
            
            all_letters.append(LetterStep(
                morse=morse_pattern,
                letter=letter,
                automaton=automaton_data,
                steps=steps
            ))
            
            decoded_words.append(letter)
        
        # Add space between words
        if word != words[-1]:  # Not the last word
            decoded_words.append(' ')
    
    decoded_text = ''.join(decoded_words)
    
    return MorseResponse(
        input=morse_input,
        decoded=decoded_text,
        letters=all_letters,
        total_steps=total_steps
    )


@router.get("/combined")
async def get_combined_automaton():
    """
    Get a combined DFA for the entire Morse alphabet
    (This would be very large - mainly for educational purposes)
    
    Returns:
        Combined automaton structure
    """
    return {
        "message": "Combined DFA generation",
        "note": "This would create a very large automaton with all Morse patterns",
        "alphabet_size": len(MORSE_TABLE),
        "recommendation": "Use per-letter mode for better visualization"
    }
