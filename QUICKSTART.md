# Quick Start Commands

## For Windows (cmd.exe)

### Option 1: Docker (Recommended - Easiest)
```cmd
cd c:\clg\fla
docker-compose up
```
Then open: http://localhost:5173

### Option 2: Manual Development Setup

**Terminal 1 - Backend:**
```cmd
cd c:\clg\fla\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```cmd
cd c:\clg\fla\frontend
npm install
npm run dev
```

Then open: http://localhost:5173

---

## What to Do After Starting

1. ✅ Open http://localhost:5173 in your browser
2. ✅ Click "Try Demo" button
3. ✅ Enter Morse code (try: `... --- ...`)
4. ✅ Click "Decode & Visualize"
5. ✅ Watch the automata animation!

---

## Quick Test

Try these in the input box:

- **SOS**: `... --- ...`
- **HELLO**: `.... . .-.. .-.. ---`
- **TEST**: `- . ... -`

---

## Stopping the Application

**Docker:**
```cmd
Ctrl+C
docker-compose down
```

**Manual:**
```cmd
Ctrl+C (in both terminals)
```

---

**Need help? Check SETUP.md for detailed instructions!**
