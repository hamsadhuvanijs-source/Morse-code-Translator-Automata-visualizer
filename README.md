# Morse Code Translator & Automata Visualizer

**An interactive educational web application demonstrating Formal Languages & Automata Theory through Morse code translation.**

## 🎯 Project Overview

A web application that translates Morse code to English text while visually demonstrating the formal-language pipeline (Regex → NFA → DFA → string acceptance) with animated state diagrams.

## 🌟 Features

- **Real-time Morse Code Translation**: Convert Morse code to English (A-Z, 0-9, punctuation)
- **Automata Visualization**: See NFA and DFA state diagrams with animated transitions
- **Educational Tools**: 
  - Thompson's construction (Regex → NFA)
  - Subset construction (NFA → DFA)
  - Step-by-step execution visualization
- **Interactive Controls**: Step through, play, pause, and reset animations
- **Export Capabilities**: Save diagrams as SVG/PNG

## 🏗️ Architecture

### Frontend
- **React.js**: Component-based UI
- **D3.js**: Graph visualization and animation
- **Tailwind CSS**: Modern, responsive styling

### Backend
- **FastAPI**: High-performance Python API
- **Automata Algorithms**: Thompson's construction, subset construction, DFA traversal

## 📁 Project Structure

```
fla/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── main.py       # FastAPI app entry
│   │   ├── automata/     # Automata algorithms
│   │   ├── models/       # Data models
│   │   └── routes/       # API endpoints
│   ├── tests/
│   └── requirements.txt
├── frontend/             # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API integration
│   │   ├── utils/        # Helper functions
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- Docker (optional)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### Using Docker

```bash
docker-compose up
```

## 📖 Usage

1. **Input Morse Code**: Enter dots (.) and dashes (-) with spaces between letters and / for word separation
2. **Visualize**: Watch the automata construction and state transitions
3. **Step Through**: Use controls to step through the animation
4. **Learn**: View regex patterns, transition tables, and algorithm explanations

### Example Input
```
... --- ...
(Translates to: SOS)
```

## 🎓 Educational Value

This project demonstrates:
- Regular expression to NFA conversion (Thompson's construction)
- NFA to DFA conversion (Subset construction)
- DFA string acceptance
- State diagram visualization
- Formal language theory in practice

## 📚 API Endpoints

- `GET /api/morse/table` - Get Morse code mapping
- `POST /api/automaton/letter` - Generate automaton for a letter
- `POST /api/automaton/parse` - Parse full Morse input

## 🤝 Contributing

This is an educational project for Formal Languages & Automata Theory course.

## 🔗 References

- International Morse Code Standard
- Introduction to Automata Theory, Languages, and Computation (Hopcroft, Ullman)
- Thompson's Construction Algorithm
- Subset Construction Method
