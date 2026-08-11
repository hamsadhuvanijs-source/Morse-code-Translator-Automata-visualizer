# Testing Guide

## Comprehensive Testing for Morse Code Automata Visualizer

---

## 🧪 Manual Testing Checklist

### 1. Backend API Testing

#### Test Setup
```cmd
cd c:\clg\fla\backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Open: http://localhost:8000/api/docs

#### Test Cases

**TC-001: Get Morse Table**
- Endpoint: `GET /api/morse/table`
- Expected: JSON with 54+ character mappings
- Verify: A→.-, S→..., O→---

**TC-002: Encode Text**
- Endpoint: `GET /api/morse/encode/SOS`
- Expected: `{ "morse": "... --- ...", ... }`

**TC-003: Decode Morse**
- Endpoint: `GET /api/morse/decode/... --- ...`
- Expected: `{ "decoded": "SOS", ... }`

**TC-004: Build Letter Automaton**
- Endpoint: `POST /api/automaton/letter`
- Body: `{ "letter": "A" }`
- Expected: NFA and DFA with states, transitions
- Verify: 
  - NFA has epsilon transitions
  - DFA is deterministic
  - Start state exists
  - Final state exists

**TC-005: Parse Morse Input**
- Endpoint: `POST /api/automaton/parse`
- Body: `{ "morse_input": "... --- ...", "mode": "per_letter" }`
- Expected: 
  - `decoded: "SOS"`
  - 3 letters in array
  - Each letter has automaton and steps

---

### 2. Frontend UI Testing

#### Test Setup
```cmd
cd c:\clg\fla\frontend
npm run dev
```

Open: http://localhost:5173

#### Test Cases

**TC-101: Landing Page**
- ✓ Page loads without errors
- ✓ Hero section displays
- ✓ Features section visible
- ✓ "Try Demo" button works
- ✓ "Learn How it Works" scrolls
- ✓ Morse code reference table shows
- ✓ Footer displays

**TC-102: Navigation**
- ✓ Click "Try Demo" → Shows main app
- ✓ Click "Back to Home" → Returns to landing

**TC-103: Input Panel**
- ✓ Text area accepts input
- ✓ Sample buttons populate input
- ✓ Decode button triggers processing
- ✓ Animation controls appear
- ✓ Toggle switches work
- ✓ Speed slider adjusts

**TC-104: Basic Translation**
- Input: `...`
- ✓ Decoded output shows "S"
- ✓ Automaton graph renders
- ✓ States visible (circles)
- ✓ Transitions visible (arrows)
- ✓ Step log updates

**TC-105: Multi-Letter Translation**
- Input: `... --- ...`
- ✓ Decoded output shows "SOS"
- ✓ Letter navigation shows (1 of 3)
- ✓ Prev/Next buttons work
- ✓ Each letter has own automaton
- ✓ Letters panel shows S, O, S

**TC-106: Animation Controls**
- ✓ Step button advances one step
- ✓ Play button starts animation
- ✓ Pause button stops animation
- ✓ Reset button returns to start
- ✓ Speed slider affects timing

**TC-107: Visualization**
- ✓ Graph renders in SVG
- ✓ Nodes are draggable
- ✓ Zoom/pan works
- ✓ Start state is blue
- ✓ Final states have double ring
- ✓ Active state highlights yellow
- ✓ Transitions animate

**TC-108: NFA/DFA Toggle**
- ✓ Toggle shows "NFA" label
- ✓ Graph updates when toggled
- ✓ NFA shows epsilon transitions
- ✓ DFA has no epsilon transitions

**TC-109: Details Panel**
- ✓ Output displays correctly
- ✓ Step log shows transitions
- ✓ Regex tab shows pattern
- ✓ Table tab shows transition table
- ✓ JSON tab shows data
- ✓ Copy button works

**TC-110: Error Handling**
- Input: Invalid characters `abc123`
- ✓ Error message displays
- ✓ No crash occurs

---

### 3. Integration Testing

**TC-201: Full Flow - Simple Letter**
1. Enter: `.-`
2. Click Decode
3. Verify:
   - ✓ API called
   - ✓ Response received
   - ✓ Output shows "A"
   - ✓ Graph renders
   - ✓ 3 states visible
   - ✓ Transitions: q0→q1(.)→q2(-)
   - ✓ Step log has 3 entries

**TC-202: Full Flow - Word**
1. Enter: `.... . .-.. .-.. ---`
2. Click Decode
3. Verify:
   - ✓ Output shows "HELLO"
   - ✓ 5 letters in navigation
   - ✓ Can navigate between letters
   - ✓ Each letter processes correctly

**TC-203: Full Flow - Multi-word**
1. Enter: `... --- ... / .... . .-.. .--.`
2. Verify:
   - ✓ Output shows "SOS HELP"
   - ✓ Space appears between words
   - ✓ 7 letters total (excluding space)

**TC-204: Animation Flow**
1. Enter: `...`
2. Set speed to slow
3. Click Play
4. Verify:
   - ✓ States highlight in sequence
   - ✓ Transitions animate
   - ✓ Step log updates
   - ✓ Progress bar advances
   - ✓ Auto-stops at end

---

### 4. Algorithm Correctness Testing

**TC-301: Thompson's Construction**
Test pattern: `.-` (letter A)

Verify NFA structure:
- ✓ States: q0, q1, q2 (+ epsilon states)
- ✓ Transitions: q0→q1 on '.', →q2 on '-'
- ✓ Epsilon transitions exist
- ✓ Start: q0
- ✓ Final: q2

**TC-302: Subset Construction**
Verify DFA from NFA:
- ✓ DFA has ≤ 2^n states (where n = NFA states)
- ✓ No epsilon transitions
- ✓ Each state has ≤1 transition per symbol
- ✓ Final states correctly identified

**TC-303: DFA Acceptance**
Test input: `...` (letter S)

Trace execution:
- ✓ Start: q0
- ✓ Read '.': → q1
- ✓ Read '.': → q2
- ✓ Read '.': → q3
- ✓ q3 is final → Accept
- ✓ Output: 'S'

**TC-304: DFA Rejection**
Test input: `..` (incomplete)

Verify:
- ✓ Processes both dots
- ✓ Ends in non-final state
- ✓ Shows rejection
- ✓ Error message displayed

---

### 5. Edge Cases & Boundary Testing

**TC-401: Empty Input**
- Input: `` (empty)
- Expected: No error, no output

**TC-402: Single Symbol**
- Input: `.`
- Expected: Decodes to 'E'

**TC-403: Long Input**
- Input: 100+ character Morse string
- Expected: Handles without crash

**TC-404: Special Characters**
- Input: `--..--` (comma)
- Expected: Decodes to ','

**TC-405: Unknown Pattern**
- Input: `......` (not in table)
- Expected: Shows '?' or error

**TC-406: Mixed Valid/Invalid**
- Input: `... xyz ---`
- Expected: Handles gracefully

**TC-407: Multiple Spaces**
- Input: `...   ---` (extra spaces)
- Expected: Treats as separate letters or filters

**TC-408: Multiple Slashes**
- Input: `... // ---`
- Expected: Multiple word separators

---

### 6. Performance Testing

**TC-501: Response Time**
- Measure: API response time for single letter
- Expected: < 100ms

**TC-502: Rendering Performance**
- Measure: Graph render time
- Expected: < 2 seconds for 10 states

**TC-503: Animation Smoothness**
- Measure: FPS during animation
- Expected: 30+ FPS

**TC-504: Large Automaton**
- Test: 20+ state DFA
- Expected: Renders without lag

---

### 7. Cross-Browser Testing

**TC-601: Chrome**
- ✓ All features work
- ✓ D3 renders correctly
- ✓ Animations smooth

**TC-602: Firefox**
- ✓ All features work
- ✓ D3 renders correctly
- ✓ Animations smooth

**TC-603: Edge**
- ✓ All features work
- ✓ D3 renders correctly
- ✓ Animations smooth

---

### 8. Responsive Design Testing

**TC-701: Desktop (1920x1080)**
- ✓ Three-panel layout visible
- ✓ All controls accessible
- ✓ Graph visible

**TC-702: Tablet (768x1024)**
- ✓ Layout adjusts
- ✓ Panels stack if needed
- ✓ Touch interactions work

**TC-703: Mobile (375x667)**
- ✓ Mobile-friendly layout
- ✓ Scrollable panels
- ✓ Controls accessible

---

## 🔍 Automated Testing (Optional)

### Backend Unit Tests

Create: `backend/tests/test_automata.py`

```python
import pytest
from app.automata.thompson import thompson_construction
from app.automata.regex_parser import parse_regex

def test_thompson_simple():
    regex_ast = parse_regex(".-")
    nfa = thompson_construction(regex_ast)
    assert nfa is not None
    assert nfa.start is not None
    assert nfa.accept is not None

def test_morse_table():
    from app.automata.morse_table import MORSE_TABLE
    assert MORSE_TABLE['A'] == '.-'
    assert MORSE_TABLE['S'] == '...'
```

Run:
```cmd
cd backend
pytest
```

---

## ✅ Test Results Template

| Test ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| TC-001 | Get Morse Table | ✅ | All mappings correct |
| TC-002 | Encode Text | ✅ | SOS encoded correctly |
| TC-003 | Decode Morse | ✅ | SOS decoded correctly |
| ... | ... | ... | ... |

---

## 🐛 Bug Tracking Template

| Bug ID | Severity | Description | Steps to Reproduce | Status |
|--------|----------|-------------|-------------------|--------|
| BUG-001 | High | Graph not rendering | 1. Load app 2. Enter morse | Fixed |
| ... | ... | ... | ... | ... |

---

## 📊 Test Summary

### Pass Criteria
- ✅ All critical tests pass
- ✅ No blocking bugs
- ✅ Algorithms produce correct output
- ✅ UI is responsive and usable
- ✅ Performance meets requirements

### Sign-off
- [ ] Backend tested ✓
- [ ] Frontend tested ✓
- [ ] Integration tested ✓
- [ ] Algorithms verified ✓
- [ ] Performance acceptable ✓

---

## 🚀 Quick Test Script

```cmd
@echo off
echo Starting Morse Code Automata Visualizer Tests
echo.

echo Test 1: Backend Health Check
curl http://localhost:8000/api/health
echo.

echo Test 2: Get Morse Table
curl http://localhost:8000/api/morse/table
echo.

echo Test 3: Encode SOS
curl "http://localhost:8000/api/morse/encode/SOS"
echo.

echo Test 4: Decode Morse
curl "http://localhost:8000/api/morse/decode/...%20---%20..."
echo.

echo Test 5: Build Automaton for S
curl -X POST http://localhost:8000/api/automaton/letter -H "Content-Type: application/json" -d "{\"letter\":\"S\"}"
echo.

echo All tests complete!
pause
```

Save as: `test_api.bat` and run to test backend.

---

**Testing Complete! Ready for Deployment! ✅**
