"""
Morse Code Table
International Morse Code mappings for A-Z, 0-9, and common punctuation
"""

# English character to Morse code mapping
MORSE_TABLE = {
    # Letters A-Z
    'A': '.-',
    'B': '-...',
    'C': '-.-.',
    'D': '-..',
    'E': '.',
    'F': '..-.',
    'G': '--.',
    'H': '....',
    'I': '..',
    'J': '.---',
    'K': '-.-',
    'L': '.-..',
    'M': '--',
    'N': '-.',
    'O': '---',
    'P': '.--.',
    'Q': '--.-',
    'R': '.-.',
    'S': '...',
    'T': '-',
    'U': '..-',
    'V': '...-',
    'W': '.--',
    'X': '-..-',
    'Y': '-.--',
    'Z': '--..',
    
    # Digits 0-9
    '0': '-----',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    
    # Punctuation and special characters
    '.': '.-.-.-',
    ',': '--..--',
    '?': '..--..',
    "'": '.----.',
    '!': '-.-.--',
    '/': '-..-.',
    '(': '-.--.',
    ')': '-.--.-',
    '&': '.-...',
    ':': '---...',
    ';': '-.-.-.',
    '=': '-...-',
    '+': '.-.-.',
    '-': '-....-',
    '_': '..--.-',
    '"': '.-..-.',
    '$': '...-..-',
    '@': '.--.-.',
    ' ': '/'  # Word separator
}

# Reverse mapping: Morse code to English character
REVERSE_MORSE_TABLE = {v: k for k, v in MORSE_TABLE.items() if k != ' '}

# Alphabet for automaton construction
MORSE_ALPHABET = ['.', '-']

def get_morse(char: str) -> str:
    """Get Morse code for a character"""
    return MORSE_TABLE.get(char.upper(), '')

def get_char(morse: str) -> str:
    """Get character from Morse code"""
    return REVERSE_MORSE_TABLE.get(morse, '')

def is_valid_morse(morse: str) -> bool:
    """Check if a string is valid Morse code"""
    return all(c in ['.', '-', ' ', '/'] for c in morse)
