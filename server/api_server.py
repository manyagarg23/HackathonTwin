"""
FastAPI server for the Hackathon Chat Agent.
"""

import uuid
from typing import Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hackathon_agent import HackathonChatAgent

app = FastAPI(title="Hackathon Chat API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store chat sessions in memory (in production, use a proper database)
chat_sessions: Dict[str, HackathonChatAgent] = {}


class ChatMessage(BaseModel):
    """Chat message model."""
    message: str
    session_id: str = None


class ChatResponse(BaseModel):
    """Chat response model."""
    response: str
    session_id: str


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    """Handle chat messages and return agent responses."""
    try:
        session_id = chat_message.session_id
        
        # Create new session if none exists or session not found
        if not session_id or session_id not in chat_sessions:
            session_id = str(uuid.uuid4())
            chat_sessions[session_id] = HackathonChatAgent()
        
        agent = chat_sessions[session_id]
        
        # Get response from agent
        if chat_message.message.lower().strip() in ['hi', 'hello', 'start']:
            # Handle initial greeting
            response = agent.get_welcome_message()
        elif chat_message.message.lower().strip() == 'summary':
            # Handle summary request
            response = agent.get_hackathon_summary()
        else:
            # Regular chat
            response = agent.chat(chat_message.message)
        
        return ChatResponse(response=response, session_id=session_id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


@app.post("/api/chat/new", response_model=ChatResponse)
async def new_chat_session():
    """Start a new chat session."""
    try:
        session_id = str(uuid.uuid4())
        agent = HackathonChatAgent()
        chat_sessions[session_id] = agent
        
        # Get welcome message
        welcome = agent.get_welcome_message()
        
        return ChatResponse(response=welcome, session_id=session_id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating new session: {str(e)}")


@app.get("/api/chat/{session_id}/summary")
async def get_summary(session_id: str):
    """Get hackathon summary for a session."""
    if session_id not in chat_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        agent = chat_sessions[session_id]
        summary = agent.get_hackathon_summary()
        return {"summary": summary}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting summary: {str(e)}")


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Hackathon Chat API is running!"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
