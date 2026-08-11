"""
Morse code routes
Endpoints for Morse code table and mappings
"""

from fastapi import APIRouter
from app.automata.morse_table import MORSE_TABLE, REVERSE_MORSE_TABLE

router = APIRouter()


@router.get("/table")
async def get_morse_table():
    """
    Get complete Morse code mapping table
    Returns dictionary of character → morse pattern
    """
    return {
        "morse_table": MORSE_TABLE,
        "reverse_table": REVERSE_MORSE_TABLE,
        "alphabet_size": len(MORSE_TABLE),
        "supported": {
            "letters": "A-Z",
            "digits": "0-9",
            "punctuation": [",", ".", "?", "'", "!", "/", "(", ")", "&", ":", ";", "=", "+", "-", "_", '"', "$", "@"]
        }
    }


@router.get("/encode/{text}")
async def encode_text(text: str):
    """
    Encode English text to Morse code
    
    Args:
        text: English text to encode
        
    Returns:
        Morse code string with spaces between letters and / between words
    """
    text = text.upper()
    morse_chars = []
    
    for char in text:
        if char == ' ':
            morse_chars.append('/')
        elif char in MORSE_TABLE:
            morse_chars.append(MORSE_TABLE[char])
        else:
            morse_chars.append('?')  # Unknown character
    
    morse_code = ' '.join(morse_chars)
    
    return {
        "input": text,
        "morse": morse_code,
        "letter_count": len([c for c in text if c != ' ']),
        "word_count": len(text.split())
    }


@router.get("/decode/{morse}")
async def decode_morse(morse: str):
    """
    Decode Morse code to English text
    
    Args:
        morse: Morse code string (spaces between letters, / between words)
        
    Returns:
        Decoded English text
    """
    words = morse.split('/')
    decoded_words = []
    
    for word in words:
        letters = word.strip().split(' ')
        decoded_letters = []
        
        for letter_morse in letters:
            if letter_morse in REVERSE_MORSE_TABLE:
                decoded_letters.append(REVERSE_MORSE_TABLE[letter_morse])
            elif letter_morse:  # Not empty
                decoded_letters.append('?')
        
        decoded_words.append(''.join(decoded_letters))
    
    decoded_text = ' '.join(decoded_words)
    
    return {
        "morse": morse,
        "decoded": decoded_text,
        "letter_count": len(morse.split()),
        "word_count": len(words)
    }
