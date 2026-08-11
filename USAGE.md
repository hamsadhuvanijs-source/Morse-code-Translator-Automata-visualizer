# Usage Examples & Tutorial

## Morse Code Automata Visualizer - Step-by-Step Guide

---

## 🎯 Basic Usage

### Example 1: Simple Letter (S)

**Input:** `...`

**What happens:**
1. Input is parsed as three dots
2. Regex `...` is created (concatenation of three dot symbols)
3. Thompson's construction builds an NFA with 4 states
4. Subset construction converts to DFA
5. DFA processes input: q0 → q1 (.) → q2 (.) → q3 (.)
6. q3 is accepting state → **Output: S**

**Try it:**
1. Enter `...` in the input box
2. Click "Decode & Visualize"
3. Watch the state transitions animate
4. See the step-by-step log in the right panel

---

### Example 2: SOS Distress Signal

**Input:** `... --- ...`

**What happens:**
1. Split into 3 letters: `...`, `---`, `...`
2. Each letter processed through its own automaton
3. First letter: S (three dots)
4. Second letter: O (three dashes)
5. Third letter: S (three dots)
6. **Output: SOS**

**Interactive features:**
- Use "Prev/Next" buttons to navigate between letters
- Watch each letter's automaton separately
- See cumulative decoded output

---

### Example 3: Hello World

**Input:** `.... . .-.. .-.. --- / .-- --- .-. .-.. -..`

**Breakdown:**
- `....` = H
- `.` = E
- `.-..` = L
- `.-..` = L
- `---` = O
- `/` = word separator (space)
- `.--` = W
- `---` = O
- `.-.` = R
- `.-..` = L
- `-..` = D

**Output:** HELLO WORLD

---

## 🎮 Feature Demonstrations

### Animation Controls

#### Step-by-Step Execution
1. Enter Morse code
2. Click "Step" button repeatedly
3. Observe each transition:
   - Yellow highlight = active state
   - Animated edge = current transition
   - Step log updates in real-time

#### Auto-Play Mode
1. Click "Play" button
2. Adjust speed slider (0-180%)
3. Watch automatic progression through states
4. Click "Pause" to stop
5. Click "Reset" to start over

#### Speed Control
- **Slow (20%)**: Best for learning and detailed observation
- **Medium (100%)**: Default balanced speed
- **Fast (180%)**: Quick overview of the process

---

### Visualization Modes

#### NFA View (Non-deterministic Finite Automaton)
- Toggle "Show NFA" switch ON
- See epsilon transitions (ε)
- Multiple possible states can be active
- More complex structure

**Best for:**
- Understanding Thompson's construction
- Seeing intermediate automaton form
- Educational purposes

#### DFA View (Deterministic Finite Automaton)
- Toggle "Show NFA" switch OFF (default)
- Single active state at a time
- Simplified, optimized structure
- No epsilon transitions

**Best for:**
- Understanding execution flow
- Clearer visualization
- Practical implementation

---

## 📊 Understanding the Visualizations

### State Diagram Elements

1. **Circles (States)**
   - Blue filled = Start state
   - Double ring = Accepting/Final state
   - Yellow pulsing = Currently active
   - White = Regular state

2. **Arrows (Transitions)**
   - Label shows input symbol (. or -)
   - Yellow animated = currently traversing
   - Arrow points to target state

3. **Start Indicator**
   - Arrow pointing to start state from outside

### Reading the Transition Table

Example for letter "A" (morse: `.-`):

| State | . | - |
|-------|---|---|
| q0    | q1| — |
| q1    | — | q2|
| q2 ✓  | — | — |

- ✓ = Accepting state
- — = No transition (error/reject)

---

## 🔬 Algorithm Walkthrough

### Thompson's Construction Example

**For morse pattern ".-" (letter A):**

1. **Symbol .** → NFA fragment
   ```
   start → (.) → accept
   ```

2. **Symbol -** → NFA fragment
   ```
   start → (-) → accept
   ```

3. **Concatenation** → Combined NFA
   ```
   start → (.) → intermediate → (-) → accept
   ```

### Subset Construction Example

**Converting the NFA above to DFA:**

1. **Initial state:** ε-closure({start}) = {q0}
2. **From q0 on '.':** move({q0}, '.') = {q1}
3. **From q1 on '-':** move({q1}, '-') = {q2}
4. **q2 contains NFA accept** → q2 is DFA final state

**Result:** DFA with states {q0, q1, q2}, transitions as shown above

---

## 💡 Educational Use Cases

### Use Case 1: Learning Automata Theory

**Objective:** Understand how regex patterns become automata

**Steps:**
1. Start with simple pattern: `.` (letter E)
2. Observe single-state NFA
3. Try concatenation: `.-` (letter A)
4. See how states connect
5. Compare NFA vs DFA views
6. Analyze transition tables

### Use Case 2: String Acceptance Algorithm

**Objective:** Understand DFA execution

**Steps:**
1. Choose pattern: `...` (letter S)
2. Enable "Show DFA"
3. Use "Step" button
4. Watch state transitions:
   - q0 → q1 on first '.'
   - q1 → q2 on second '.'
   - q2 → q3 on third '.'
5. Verify q3 is accepting → String accepted

### Use Case 3: Error Handling

**Objective:** See rejection in action

**Steps:**
1. Enter: `..` (incomplete S)
2. Decode and step through
3. Watch: q0 → q1 → q2
4. q2 is NOT accepting → Rejected
5. Error shown in step log

---

## 🎓 Advanced Features

### Regex Analysis

View the regex representation:
1. Decode any Morse pattern
2. Click "Regex" tab in right panel
3. See regex breakdown
4. Understand pattern structure

### JSON Export

Get automaton data:
1. Click "JSON" tab
2. View complete automaton structure
3. Copy to clipboard
4. Use for further analysis or reports

### SVG Export

Save diagrams:
1. Click "Export SVG" button
2. Download state diagram
3. Include in presentations/papers

---

## 📝 Sample Exercises

### Exercise 1: Basic Translation
**Task:** Translate "HELP" to Morse code
**Solution:** `.... . .-.. .--.`
**Try it:** Enter this and verify output

### Exercise 2: State Counting
**Task:** How many states in DFA for letter "B" (`-...`)?
**Solution:** Enter `-...`, count states in visualization

### Exercise 3: Compare NFA/DFA
**Task:** For pattern `--`, compare NFA and DFA state counts
**Solution:** Toggle views and count

### Exercise 4: Multi-word Message
**Task:** Decode `... --- ... / .... . .-.. .--.`
**Expected:** SOS HELP

---

## 🐛 Common Issues & Solutions

### Issue: "No transition found"
**Cause:** Invalid Morse pattern
**Solution:** Check symbols are only . - space and /

### Issue: Animation too fast/slow
**Solution:** Adjust speed slider

### Issue: Can't see all states
**Solution:** Use zoom controls or "Fit" button

### Issue: Wrong output
**Cause:** Incorrect spacing
**Solution:** 
- Space between letters
- / between words
- No spaces within letter patterns

---

## 🎯 Best Practices

1. **Start Simple:** Begin with single letters before words
2. **Use Samples:** Try provided sample inputs first
3. **Step Through:** Use step mode for learning
4. **Compare Views:** Toggle NFA/DFA to understand differences
5. **Read Logs:** Study step-by-step execution logs
6. **Experiment:** Try creating your own messages

---

## 📚 Additional Resources

### Morse Code Reference

Quick reference table:
- A: `.-`    N: `-.`
- B: `-...`  O: `---`
- C: `-.-.`  P: `.--.`
- D: `-..`   S: `...`
- E: `.`     T: `-`

[Full table available in the app]

### Automata Theory Concepts

- **NFA:** Can have multiple active states
- **DFA:** Exactly one active state at any time
- **ε-transition:** Move without consuming input
- **Accepting state:** Valid end state for input

---

**Happy Learning! 🎓**

For more help, check:
- Landing page tutorial
- API documentation (http://localhost:8000/api/docs)
- Algorithm explanations in right panel
