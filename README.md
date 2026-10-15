# Deeptext

Deeptext is a simple AI chat application built with a FastAPI backend and a React frontend. It demonstrates a lightweight full-stack setup where a user sends a message from the frontend, the backend forwards it to an AI model, and the response is displayed in the chat UI.

## Project Overview

This project combines:
- Python backend with FastAPI
- React + Vite frontend
- AI model integration with Groq / LangChain
- Local development workflow for testing before deployment

## Tech Stack

### Backend
- Python
- FastAPI
- Pydantic
- LangChain
- Groq model integration (`qwen/qwen3.8-27b`)

### Frontend
- React
- Vite
- JavaScript

## Folder Structure

```text
MyChatApp/
├── .gitignore
├── README.md
├── backend/
│   ├── chatbot.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── index.html
└── .env (local only, never commit)
```

## Local Setup

### 1. Create and activate virtual environment

```bash
cd MyChatApp
python -m venv .venv
source .venv/Scripts/activate
```

### 2. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start the backend

From the project root or backend folder:

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Open the frontend in the browser at:

```text
http://localhost:5173
```

## Environment Variables

Create `backend/.env` locally with your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Environment files are excluded by `.gitignore`. Never commit API keys or paste them into source files.

## Deployment on Render

Render can host this app in two main ways:

### Option 1: Deploy frontend and backend as separate services
- Backend: Python web service
- Frontend: static site or Node/Vite service

### Option 2: Deploy backend only and keep frontend in a static host
- Use Render for the FastAPI API
- Use Netlify or Vercel for the frontend if preferred

## Render Backend Deployment Steps

1. Push the project to GitHub.
2. Go to Render and create a new Web Service.
3. Connect your GitHub repository.
4. Set the root directory to the backend folder if your repo is structured that way.
5. Choose Python as the runtime.
6. Add a build command, for example:

```bash
pip install -r requirements.txt
```

7. Add a start command:

```bash
gunicorn main:app --host 0.0.0.0 --port 10000
```

If your app uses FastAPI with Uvicorn, the start command can also be:

```bash
uvicorn main:app --host 0.0.0.0 --port 10000
```

## Important Notes for Render

- Add your environment variables in the Render dashboard.
- Add `GROQ_API_KEY` in the Render environment settings.
- Use CORS settings that allow your frontend domain.
- If the frontend talks to a separate backend, change the API URL in the React app to your live Render URL.

## GitHub Workflow

1. Initialize git in the repo root.
2. Add files:

```bash
git add .
```

3. Commit:

```bash
git commit -m "Initial Deeptext app setup"
```

4. Create a remote repository on GitHub.
5. Push:

```bash
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Future Improvements

- Add user authentication
- Add chat history persistence
- Support streaming responses
- Improve UI styling and dark mode
- Add proper model error handling
- Deploy frontend and backend in production mode

## License

This project is for learning and demo purposes.
