"""
Morse code request/response models
"""

from typing import Optional, List, Dict
from pydantic import BaseModel, Field


class LetterRequest(BaseModel):
    """Request for generating automaton for a single letter"""
    letter: Optional[str] = Field(None, description="English letter (A-Z, 0-9)")
    morse: Optional[str] = Field(None, description="Morse code pattern")
    
    class Config:
        json_schema_extra = {
            "example": {
                "letter": "S"
            }
        }


class ParseRequest(BaseModel):
    """Request for parsing full Morse code input"""
    morse_input: str = Field(..., description="Complete Morse code string")
    mode: str = Field(default="per_letter", description="Processing mode: per_letter or combined")
    
    class Config:
        json_schema_extra = {
            "example": {
                "morse_input": "... --- ...",
                "mode": "per_letter"
            }
        }


class LetterStep(BaseModel):
    """Single letter parsing step"""
    morse: str = Field(..., description="Morse pattern for this letter")
    letter: str = Field(..., description="Decoded letter")
    automaton: Optional[Dict] = Field(None, description="Automaton data for this letter")
    steps: List[Dict] = Field(default_factory=list, description="Step-by-step execution log")


class MorseResponse(BaseModel):
    """Response for Morse code parsing"""
    input: str = Field(..., description="Original Morse input")
    decoded: str = Field(..., description="Decoded English text")
    letters: List[LetterStep] = Field(..., description="Per-letter breakdown")
    total_steps: int = Field(..., description="Total number of steps")
    
    class Config:
        json_schema_extra = {
            "example": {
                "input": "... --- ...",
                "decoded": "SOS",
                "letters": [
                    {
                        "morse": "...",
                        "letter": "S",
                        "steps": []
                    }
                ],
                "total_steps": 9
            }
        }
