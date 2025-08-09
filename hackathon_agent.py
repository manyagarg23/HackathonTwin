"""
Simple chat agent for collecting hackathon configuration details from clients.
"""

import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Load environment variables
load_dotenv()


class HackathonChatAgent:
    """Simple chat agent for hackathon information collection."""
    
    def __init__(self):
        # Initialize the Gemini model
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-pro",
            google_api_key=api_key,
            temperature=0.7
        )
        
        # Create prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", self._get_system_prompt()),
            ("human", "Conversation so far:\n{conversation_history}\n\nUser: {user_input}")
        ])
        
        # Create the chain
        self.chain = self.prompt | self.llm | StrOutputParser()
        
        # Store conversation history
        self.conversation_history = []
        self.hackathon_details = {}
    
    def _get_system_prompt(self):
        """Get the system prompt for the agent."""
        return """You are a friendly AI assistant helping clients set up their hackathon. Your goal is to collect all the important details about their hackathon in a conversational way.

You need to gather the following information:

ESSENTIAL DETAILS:
- Hackathon name
- Theme/description
- Start date and end date
- Duration (how many hours/days)
- Type: Virtual, In-person, or Hybrid
- Expected number of participants
- Target audience (students, professionals, beginners, etc.)
- Organizer name and contact information

ADDITIONAL DETAILS (ask about these naturally during conversation):
- Registration deadline
- Team size limits
- Prizes and awards
- Key events/schedule highlights
- Judging criteria
- Required skills or technologies
- Sponsors (if any)
- Special features (mentorship, workshops, etc.)

CONVERSATION GUIDELINES:
- Start with a warm welcome and brief explanation of what you're helping with
- Ask questions naturally, 1-3 related questions at a time
- Be conversational and encouraging
- Show enthusiasm about their hackathon
- Summarize information back to confirm understanding
- When you have most essential details, offer to create a summary
- Don't overwhelm with too many questions at once

Remember: You're helping them plan an amazing hackathon! Be supportive and excited about their event."""

    def chat(self, user_input: str) -> str:
        """Process user input and return agent response."""
        # Format conversation history for context
        history_text = "\n".join([
            f"User: {msg['user']}\nAgent: {msg['agent']}" 
            for msg in self.conversation_history[-3:]  # Keep last 3 exchanges for context
        ])
        
        # Get response from the agent
        response = self.chain.invoke({
            "conversation_history": history_text,
            "user_input": user_input
        })
        
        # Store in conversation history
        self.conversation_history.append({
            "user": user_input,
            "agent": response
        })
        
        return response
    
    def get_welcome_message(self) -> str:
        """Get initial welcome message."""
        return self.chat("Hi there! I'm ready to help you set up your hackathon.")
    
    def get_hackathon_summary(self) -> str:
        """Generate a summary of collected hackathon details."""
        if not self.conversation_history:
            return "No hackathon details collected yet."
        
        # Use the agent to create a summary
        summary_prompt = """Based on our conversation, please create a well-organized summary of the hackathon details we've discussed. 

Format it clearly with sections like:
- Basic Information
- Event Details  
- Participation
- Additional Features

If any important details are missing, mention what else we might need to know."""
        
        return self.chat(summary_prompt)


def main():
    """Main function to run the chat agent."""
    print("🚀 Hackathon Setup Assistant")
    print("=" * 50)
    print("I'll help you configure your hackathon! Let's start by learning about your event.\n")
    
    # Initialize agent
    try:
        agent = HackathonChatAgent()
    except ValueError as e:
        print(f"Error: {e}")
        print("Please set your GOOGLE_API_KEY in a .env file")
        return
    
    # Start conversation
    print("Agent:", agent.get_welcome_message())
    print()
    
    while True:
        try:
            # Get user input
            user_input = input("You: ").strip()
            
            if not user_input:
                continue
                
            # Handle special commands
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("\nAgent: Thanks for setting up your hackathon with me! Good luck with your event! 🎉")
                break
            elif user_input.lower() == 'summary':
                print("\nAgent:", agent.get_hackathon_summary())
                print()
                continue
            
            # Get agent response
            response = agent.chat(user_input)
            print(f"\nAgent: {response}")
            print()
            
        except KeyboardInterrupt:
            print("\n\nAgent: Thanks for using the Hackathon Setup Assistant! Goodbye! 👋")
            break
        except Exception as e:
            print(f"\nError: {e}")
            print("Please try again.")


if __name__ == "__main__":
    main()
