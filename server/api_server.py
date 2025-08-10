"""
FastAPI server for the Hackathon Chat Agent.
"""

import uuid
from typing import Dict
import os
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from hackathon_agent import HackathonChatAgent
from outreach_service import OutreachService
from helper.embeddings import create_vector_embeddings
from helper.rag_agent import create_rag_agent

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Hackathon Chat API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],  # Vite and React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store chat sessions in memory (in production, use a proper database)
chat_sessions: Dict[str, HackathonChatAgent] = {}

# Initialize outreach service
outreach_service = OutreachService()


class ChatMessage(BaseModel):
    """Chat message model."""

    message: str
    session_id: str = None


class ChatResponse(BaseModel):
    """Chat response model."""

    response: str
    session_id: str


class OutreachResponse(BaseModel):
    """Outreach campaign response model."""

    success: bool
    summary: Dict = None
    results: list = None
    error: str = None


class SMTPConfigRequest(BaseModel):
    """SMTP configuration request model."""

    email: str
    password: str


class SMTPConfigResponse(BaseModel):
    """SMTP configuration response model."""

    success: bool
    message: str = None
    error: str = None


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
        if chat_message.message.lower().strip() in ["hi", "hello", "start"]:
            # Handle initial greeting
            response = agent.get_welcome_message()
        elif chat_message.message.lower().strip() == "summary":
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
        raise HTTPException(
            status_code=500, detail=f"Error creating new session: {str(e)}"
        )


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


@app.post("/api/outreach/upload-csv", response_model=OutreachResponse)
async def upload_csv(file: UploadFile = File(...)):
    """Upload and process CSV file for outreach campaign."""
    try:
        if not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="File must be a CSV")

        # Read CSV content
        csv_content = await file.read()
        csv_text = csv_content.decode("utf-8")

        # Process outreach campaign
        result = outreach_service.process_outreach_campaign(csv_text)

        return OutreachResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")


@app.get("/api/outreach/sample-csv")
async def get_sample_csv():
    """Get sample CSV structure for users."""
    try:
        sample_csv = outreach_service.get_sample_csv_structure()
        return {"sample_csv": sample_csv}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error getting sample CSV: {str(e)}"
        )


@app.post("/api/outreach/configure-smtp", response_model=SMTPConfigResponse)
async def configure_smtp(config: SMTPConfigRequest):
    """Configure SMTP credentials for the outreach service."""
    try:
        # Update the outreach service with new SMTP credentials
        outreach_service.update_smtp_credentials(
            username=config.email, password=config.password, from_email=config.email
        )

        return SMTPConfigResponse(
            success=True, message="SMTP credentials configured successfully"
        )

    except Exception as e:
        return SMTPConfigResponse(
            success=False, error=f"Failed to configure SMTP: {str(e)}"
        )


@app.post("/api/add_logistics")
async def add_logistics(file: UploadFile = File(...)):
    """Upload a logistics document (PDF or text)."""
    try:
        # Define the upload directory
        upload_dir = "helper/data"
        os.makedirs(upload_dir, exist_ok=True)

        # Save the uploaded file
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        return {
            "message": f"File '{file.filename}' uploaded successfully to logistics."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")


@app.post("/api/add_wiki")
async def add_wiki(file: UploadFile = File(...)):
    """Upload a wiki document (PDF or text)."""
    try:
        # Define the upload directory
        upload_dir = "helper/data"
        os.makedirs(upload_dir, exist_ok=True)

        # Save the uploaded file
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Create and save vector embeddings
        try:
            vector_store = create_vector_embeddings(data_directory=upload_dir)
            vector_store.save_local("helper/faiss_index")
        except Exception as e:
            import traceback
            print("Error creating vector embeddings:")
            traceback.print_exc()
            raise e

        return {
            "message": f"File '{file.filename}' uploaded and processed successfully."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")


@app.post("/api/rag/chat", response_model=ChatResponse)
async def rag_chat_endpoint(chat_message: ChatMessage):
    """Handle chat messages using the RAG agent."""
    try:
        index_path = "helper/faiss_index"
        
        # Check if index exists
        if not os.path.exists(index_path):
            raise HTTPException(
                status_code=404,
                detail="FAISS index not found. Please upload a wiki document first.",
            )

        # Create RAG agent
        rag_agent = create_rag_agent(index_path)
        
        # Get response from RAG agent
        response_data = rag_agent.invoke({"input": chat_message.message})
        answer = response_data.get("answer", "No answer found.")
        
        # For now, we don't manage RAG sessions, so we create a new session_id each time
        session_id = str(uuid.uuid4())

        return ChatResponse(response=answer, session_id=session_id)
        
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing RAG chat: {str(e)}")


@app.get("/api/get_wiki")
async def get_wiki():
    """Return the first PDF wiki document found."""
    try:
        data_dir = "helper/data"
        if not os.path.exists(data_dir):
            raise HTTPException(status_code=404, detail="Data directory not found.")

        for filename in os.listdir(data_dir):
            if filename.lower().endswith(".pdf"):
                file_path = os.path.join(data_dir, filename)
                return FileResponse(
                    file_path,
                    media_type="application/pdf",
                    filename=filename,
                )

        raise HTTPException(status_code=404, detail="No wiki PDF found.")

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving wiki: {str(e)}"
        )


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