"""
Regular Expression to AST Parser
Converts simple regex patterns to Abstract Syntax Tree
For Morse code: handles concatenation, union (|), and Kleene star (*)
"""

from typing import Union, List
from enum import Enum


class NodeType(Enum):
    """Types of regex AST nodes"""
    SYMBOL = "symbol"
    CONCAT = "concat"
    UNION = "union"
    STAR = "star"
    EPSILON = "epsilon"


class RegexNode:
    """Node in the regex Abstract Syntax Tree"""
    
    def __init__(self, node_type: NodeType, value: str = None, left=None, right=None):
        self.type = node_type
        self.value = value
        self.left = left
        self.right = right
    
    def __repr__(self):
        if self.type == NodeType.SYMBOL:
            return f"Symbol({self.value})"
        elif self.type == NodeType.EPSILON:
            return "Epsilon"
        elif self.type == NodeType.CONCAT:
            return f"Concat({self.left}, {self.right})"
        elif self.type == NodeType.UNION:
            return f"Union({self.left}, {self.right})"
        elif self.type == NodeType.STAR:
            return f"Star({self.left})"
        return "Unknown"


def morse_to_regex(morse: str) -> str:
    """
    Convert Morse pattern to regex string
    For simple concatenation patterns (like Morse), this is straightforward
    
    Args:
        morse: Morse pattern (e.g., ".-")
    
    Returns:
        Regex string representation
    """
    # For Morse, the pattern is already a simple concatenation
    # We just escape special regex characters if needed
    return morse


def parse_regex(regex: str) -> RegexNode:
    """
    Parse regex string to AST
    Supports: concatenation, union (|), Kleene star (*), parentheses
    
    Args:
        regex: Regular expression string
        
    Returns:
        Root node of the AST
    """
    if not regex:
        return RegexNode(NodeType.EPSILON)
    
    # For simple Morse patterns (just dots and dashes), we build a concatenation tree
    if all(c in ['.', '-'] for c in regex):
        return _parse_concat(regex)
    
    # For more complex patterns with operators
    return _parse_union(_tokenize(regex))


def _tokenize(regex: str) -> List[str]:
    """Tokenize regex into symbols and operators"""
    tokens = []
    i = 0
    while i < len(regex):
        if regex[i] in ['.', '-', '(', ')', '|', '*']:
            tokens.append(regex[i])
        i += 1
    return tokens


def _parse_concat(regex: str) -> RegexNode:
    """Parse simple concatenation pattern (for Morse)"""
    if len(regex) == 0:
        return RegexNode(NodeType.EPSILON)
    if len(regex) == 1:
        return RegexNode(NodeType.SYMBOL, regex[0])
    
    # Build left-associative concatenation tree
    left = RegexNode(NodeType.SYMBOL, regex[0])
    for i in range(1, len(regex)):
        right = RegexNode(NodeType.SYMBOL, regex[i])
        left = RegexNode(NodeType.CONCAT, left=left, right=right)
    
    return left


def _parse_union(tokens: List[str]) -> RegexNode:
    """Parse union operations"""
    # Simplified parser for basic patterns
    # For full implementation, would need proper precedence and associativity handling
    if not tokens:
        return RegexNode(NodeType.EPSILON)
    
    if len(tokens) == 1:
        return RegexNode(NodeType.SYMBOL, tokens[0])
    
    # Build concatenation by default
    left = RegexNode(NodeType.SYMBOL, tokens[0])
    for i in range(1, len(tokens)):
        if tokens[i] == '*' and left:
            left = RegexNode(NodeType.STAR, left=left)
        elif tokens[i] == '|':
            # Union operation
            right = _parse_union(tokens[i+1:])
            return RegexNode(NodeType.UNION, left=left, right=right)
        elif tokens[i] not in ['(', ')']:
            right = RegexNode(NodeType.SYMBOL, tokens[i])
            left = RegexNode(NodeType.CONCAT, left=left, right=right)
    
    return left
