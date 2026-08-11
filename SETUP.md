# Setup Instructions

## Morse Code Translator & Automata Visualizer

### Prerequisites

- **Python 3.9+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **pip** (Python package manager)
- **npm** (Node package manager)
- **Git** (optional) - [Download Git](https://git-scm.com/)

---

## Quick Start (Recommended)

### Option 1: Using Docker (Easiest)

1. **Install Docker Desktop**
   - Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Ensure Docker is running

2. **Navigate to project directory**
   ```cmd
   cd c:\clg\fla
   ```

3. **Start all services with Docker Compose**
   ```cmd
   docker-compose up
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs

5. **Stop services**
   ```cmd
   docker-compose down
   ```

---

### Option 2: Manual Setup (Development)

#### Step 1: Setup Backend (FastAPI)

1. **Navigate to backend directory**
   ```cmd
   cd c:\clg\fla\backend
   ```

2. **Create virtual environment** (recommended)
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```cmd
   pip install -r requirements.txt
   ```

4. **Run the FastAPI server**
   ```cmd
   uvicorn app.main:app --reload
   ```

   The backend API will be running at: **http://localhost:8000**

5. **Verify backend is running**
   - Open browser: http://localhost:8000
   - API documentation: http://localhost:8000/api/docs

#### Step 2: Setup Frontend (React)

1. **Open a NEW command prompt/terminal**

2. **Navigate to frontend directory**
   ```cmd
   cd c:\clg\fla\frontend
   ```

3. **Install dependencies**
   ```cmd
   npm install
   ```

4. **Run the development server**
   ```cmd
   npm run dev
   ```

   The frontend will be running at: **http://localhost:5173**

5. **Access the application**
   - Open browser: http://localhost:5173

---

## Project Structure

```
c:\clg\fla\
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── automata/       # Automata algorithms
│   │   │   ├── morse_table.py
│   │   │   ├── regex_parser.py
│   │   │   ├── thompson.py
│   │   │   └── subset_construction.py
│   │   ├── models/         # Pydantic models
│   │   │   ├── automaton.py
│   │   │   └── morse.py
│   │   └── routes/         # API endpoints
│   │       ├── morse.py
│   │       └── automaton.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── MainApp.jsx
│   │   │   ├── InputPanel.jsx
│   │   │   ├── VisualizerPanel.jsx
│   │   │   ├── AutomataGraph.jsx
│   │   │   ├── DetailsPanel.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/      # API integration
│   │   │   └── api.js
│   │   ├── utils/         # Helper functions
│   │   │   └── helpers.js
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Styles
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml      # Docker orchestration
└── README.md              # Project documentation
```

---

## Testing the Application

### 1. Test Backend API

Open http://localhost:8000/api/docs and try these endpoints:

- **GET /api/morse/table** - Get Morse code table
- **POST /api/automaton/letter** - Generate automaton for a letter
  ```json
  {
    "letter": "S"
  }
  ```
- **POST /api/automaton/parse** - Parse Morse input
  ```json
  {
    "morse_input": "... --- ...",
    "mode": "per_letter"
  }
  ```

### 2. Test Frontend

1. Navigate to http://localhost:5173
2. Click "Try Demo"
3. Try sample inputs:
   - **SOS**: `... --- ...`
   - **HELLO**: `.... . .-.. .-.. ---`
   - **MORSE**: `-- --- .-. ... .`

4. Test features:
   - Step through animation
   - Play/Pause controls
   - Toggle NFA/DFA view
   - Adjust animation speed
   - View step logs and transition tables

---

## Troubleshooting

### Backend Issues

**Error: "Module not found"**
```cmd
# Ensure virtual environment is activated
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Error: "Port 8000 already in use"**
```cmd
# Change port in command
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**Error: "Cannot find module"**
```cmd
# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install
```

**Error: "Port 5173 already in use"**
- Edit `vite.config.js` and change the port number

**API connection issues**
- Ensure backend is running on port 8000
- Check proxy configuration in `vite.config.js`

### Docker Issues

**Docker not starting**
- Ensure Docker Desktop is running
- Check Docker service status

**Port conflicts**
- Stop other services using ports 8000 or 5173
- Or modify ports in `docker-compose.yml`

---

## Development Tips

### Backend Development

1. **Auto-reload is enabled** - Changes to Python files will automatically reload the server

2. **API Documentation** - Always available at http://localhost:8000/api/docs

3. **Testing algorithms**:
   ```python
   # Test Thompson's construction
   from app.automata.thompson import thompson_construction
   from app.automata.regex_parser import parse_regex
   
   regex_ast = parse_regex(".-")
   nfa = thompson_construction(regex_ast)
   print(nfa.to_dict())
   ```

### Frontend Development

1. **Hot reload enabled** - Changes to React files will automatically update

2. **Component development**:
   - Components are in `src/components/`
   - API calls are centralized in `src/services/api.js`

3. **Styling**:
   - Using Tailwind CSS
   - Custom styles in `src/index.css`

---

## Building for Production

### Backend
```cmd
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```cmd
cd frontend
npm run build
npm run preview
```

### Docker Production
```cmd
docker-compose up --build
```

---

## Next Steps

1. ✅ Start both backend and frontend servers
2. ✅ Open http://localhost:5173 in your browser
3. ✅ Click "Try Demo"
4. ✅ Enter Morse code: `... --- ...`
5. ✅ Watch the automata visualization!

---

## Support

For issues or questions:
- Check API documentation: http://localhost:8000/api/docs
- Review console logs in browser DevTools (F12)
- Check backend terminal for error messages

## Educational Resources

- **Thompson's Construction**: Converts regex to NFA
- **Subset Construction**: Converts NFA to DFA
- **DFA Traversal**: String acceptance algorithm
- **Morse Code**: International standard for communication

---

**Happy coding! 🎓📡**
