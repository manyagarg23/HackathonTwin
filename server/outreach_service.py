"""
Outreach Service for Hackathon Admin Portal
Handles CSV processing, contact classification, and AI-powered email generation
"""

import os
import csv
import smtplib
import pandas as pd
from io import StringIO
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Dict, Any
from dataclasses import dataclass
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Contact:
    """Contact information from CSV"""

    name: str
    email: str
    role: str
    company: str = ""
    phone: str = ""
    notes: str = ""


class OutreachService:
    """Main service for handling outreach operations"""

    def __init__(self):
        self.gemini = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",  # Using the latest model
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.7,  # Slightly higher creativity
        )

        # SMTP Configuration
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))

    def update_smtp_credentials(self, username: str, password: str, from_email: str):
        """Update SMTP credentials dynamically"""
        self.smtp_username = username
        self.smtp_password = password
        self.from_email = from_email

    def process_csv(self, csv_content: str) -> List[Contact]:
        """Process uploaded CSV content and return structured contacts"""
        try:
            # Clean the CSV content and create a StringIO object for pandas
            csv_content = csv_content.strip()
            csv_io = StringIO(csv_content)

            # Parse CSV content using StringIO
            df = pd.read_csv(csv_io)

            contacts = []
            for _, row in df.iterrows():
                contact = Contact(
                    name=str(row.get("name", "")),
                    email=str(row.get("email", "")),
                    role=str(row.get("role", "")),
                    company=str(row.get("company", "")),
                    phone=str(row.get("phone", "")),
                    notes=str(row.get("notes", "")),
                )
                contacts.append(contact)

            return contacts
        except Exception as e:
            raise ValueError(f"Error processing CSV: {str(e)}")

    def classify_contact(self, contact: Contact) -> str:
        """Classify contact based on role and company information"""
        role_lower = contact.role.lower()
        company_lower = contact.company.lower()

        # Simple classification logic
        if any(
            word in role_lower
            for word in ["judge", "mentor", "alumni", "past employee"]
        ):
            return "judge"
        elif any(word in role_lower for word in ["sponsor", "partner", "corporate"]):
            return "sponsor"
        else:
            return "participant"

    def generate_personalized_email(
        self, contact: Contact, contact_type: str
    ) -> Dict[str, str]:
        """Generate complete personalized email using Gemini AI"""

        # Create dynamic context based on contact type
        context_prompts = {
            "participant": {
                "tone": "enthusiastic and welcoming",
                "focus": "highlighting the exciting opportunities, learning potential, and networking benefits",
                "call_to_action": "encourage them to register and share their interests",
                "benefits": "access to mentors, workshops, prizes, and career opportunities",
            },
            "judge": {
                "tone": "respectful and appreciative",
                "focus": "emphasizing their expertise, the impact they can have, and recognition",
                "call_to_action": "invite them to share their judging preferences and availability",
                "benefits": "recognition, networking with industry leaders, and contributing to student success",
            },
            "sponsor": {
                "tone": "professional and strategic",
                "focus": "highlighting ROI, brand visibility, and talent acquisition opportunities",
                "call_to_action": "propose a call to discuss partnership details and sponsorship tiers",
                "benefits": "brand exposure, access to top talent, and community impact",
            },
        }

        context = context_prompts.get(contact_type, context_prompts["participant"])

        prompt_template = ChatPromptTemplate.from_template("""
        You are an expert email copywriter specializing in hackathon outreach campaigns. 
        Your goal is to create highly personalized, compelling emails that feel like they were written specifically for each recipient.
        
        HACKATHON DETAILS (Use these specific details throughout the email):
        - Event: "TechInnovate 2024" - A 48-hour innovation marathon
        - Date: March 15-17, 2024
        - Location: University of Maryland, College Park
        - Theme: "AI-Powered Solutions for Tomorrow's Challenges"
        - Prize Pool: $25,000+ in cash prizes and tech gadgets
        - Special Tracks: AI/ML, Sustainability, Healthcare Tech, FinTech, Education Innovation
        - Mentors: Industry experts from Google, Microsoft, Amazon, and local startups
        - Workshops: Hands-on sessions on AI tools, pitch development, and business modeling
        - Networking: 500+ participants, 50+ mentors, 20+ sponsor representatives
        - Post-Event: Demo day with VCs and potential investors
        
        CONTACT DETAILS:
        - Name: {name}
        - Role: {role}
        - Company: {company}
        - Contact Type: {contact_type}
        - Notes: {notes} (CRITICAL: This is the most important field for personalization)
        
        CONTEXT & TONE:
        - Tone: {tone}
        - Focus: {focus}
        - Call to Action: {call_to_action}
        - Key Benefits: {benefits}
        
        CRITICAL PERSONALIZATION REQUIREMENTS (Focus heavily on these):
        1. **NOTES FIELD INTEGRATION (MOST IMPORTANT)**: 
           - Extract every detail from their notes
           - Reference their specific interests, skills, or background mentioned
           - Connect their notes to specific hackathon opportunities
           - If they mention AI/ML, reference the AI track and workshops
           - If they mention previous experience, acknowledge it
           - If they mention specific goals, address them directly
        
        2. **Company-Specific Deep Dive**: 
           - Research their company's industry and recent developments
           - Mention specific company achievements, news, or projects
           - Connect their company's mission to hackathon themes
           - Reference their company's location if relevant to the event
        
        3. **Role-Based Specificity**:
           - Don't just mention their job title - explain HOW their role connects to hackathon opportunities
           - For engineers: mention specific tech stacks, tools, or challenges
           - For managers: highlight leadership and team-building opportunities
           - For students: emphasize learning and career development
        
        4. **Industry Context & Trends**:
           - Reference current industry challenges or opportunities
           - Mention specific technologies or methodologies relevant to their field
           - Connect to broader industry trends (AI revolution, sustainability focus, etc.)
        
        EMAIL STRUCTURE (Make each section detailed and personalized):
        - **Subject Line**: 50-60 characters, specific to their notes/company/role, compelling
        - **Greeting**: Use their name naturally, reference their company
        - **Opening Hook (2-3 sentences)**: 
          * Start with something specific from their notes or company
          * Connect it to current industry trends or challenges
          * Lead into the hackathon opportunity
        - **Personalized Value Proposition (3-4 sentences)**:
          * What specific benefits will THEY get based on their notes/role
          * Reference specific hackathon tracks, workshops, or opportunities
          * Connect to their stated interests or goals
        - **Detailed Personalization (4-5 sentences)**:
          * Deep dive into their notes - extract and expand on every detail
          * Connect their background to specific hackathon elements
          * Mention relevant mentors, workshops, or networking opportunities
        - **Specific Call to Action (2-3 sentences)**:
          * Clear next steps based on their contact type
          * Reference specific dates, deadlines, or contact methods
          * Make it easy for them to respond
        - **Closing**: Professional but warm, reference their specific interests again
        
        STYLE GUIDELINES:
        - Write 4-6 detailed paragraphs (not short, generic statements)
        - Use specific details from their notes in every paragraph
        - Vary sentence structure and length for natural flow
        - Include 2-3 industry-specific references or trends
        - Make it feel like you've researched their background extensively
        - Use their notes as the foundation for the entire email
        - Don't be generic - every sentence should feel personal to them
        
        LENGTH REQUIREMENT: The email body should be 300-500 words, providing substantial detail and personalization.
        
        CRITICAL OUTPUT FORMAT REQUIREMENT:
        You MUST return ONLY a valid JSON object with exactly this structure:
        {{
            "subject": "Your personalized subject line here (50-60 characters)",
            "body": "Your detailed email body here with multiple paragraphs (300-500 words)"
        }}
        
        DO NOT include any other text, explanations, or markdown formatting.
        DO NOT use markdown code blocks.
        Return ONLY the raw JSON object.
        
        The email should feel like it was written specifically for {name} at {company} after extensive research, with their notes being the central focus of personalization.
        """)

        chain = prompt_template | self.gemini | StrOutputParser()

        try:
            response = chain.invoke(
                {
                    "name": contact.name,
                    "role": contact.role,
                    "company": contact.company,
                    "contact_type": contact_type,
                    "notes": contact.notes,
                    "tone": context["tone"],
                    "focus": context["focus"],
                    "call_to_action": context["call_to_action"],
                    "benefits": context["benefits"],
                }
            )

            # Debug logging
            print(f"\n=== AI Response for {contact.name} ===")
            print(f"Raw response length: {len(response)} characters")
            print(f"Raw response preview: {response[:200]}...")
            print(f"Response contains 'subject': {'subject' in response.lower()}")
            print(f"Response contains 'body': {'body' in response.lower()}")
            print(f"Response contains '{{': {'{' in response}")
            print(f"Response contains '}}': {'}' in response}")
            print("=" * 50)

            # Clean the response and try to parse JSON
            import json
            import re

            # Clean the response - remove markdown formatting if present
            cleaned_response = response.strip()
            cleaned_response = re.sub(r"```json\s*", "", cleaned_response)
            cleaned_response = re.sub(r"\s*```", "", cleaned_response)

            print(f"Cleaned response: {cleaned_response[:200]}...")

            try:
                email_data = json.loads(cleaned_response)
                print(
                    f"JSON parsed successfully! Subject: {email_data.get('subject', 'N/A')}"
                )
                print(f"Body word count: {len(email_data.get('body', '').split())}")

                # Validate the response has required fields
                if "subject" in email_data and "body" in email_data:
                    # Ensure the body is long enough (at least 200 words)
                    body_word_count = len(email_data["body"].split())
                    if body_word_count < 200:
                        print(
                            f"Email too short ({body_word_count} words), regenerating..."
                        )
                        # If too short, regenerate with a more specific prompt
                        return self._regenerate_longer_email(
                            contact, contact_type, context
                        )

                    return {
                        "subject": email_data["subject"],
                        "body": email_data["body"],
                    }
                else:
                    print("Missing required fields in AI response")
                    raise ValueError("Missing required fields in AI response")

            except json.JSONDecodeError as json_error:
                print(f"JSON parsing failed: {json_error}")
                # If JSON parsing fails, try to extract content manually
                return self._extract_email_from_text(response, contact, contact_type)

        except Exception as e:
            print(f"Error generating email for {contact.name}: {str(e)}")
            # Fallback to a more detailed generic email
            return self._generate_fallback_email(contact, contact_type, context)

    def _regenerate_longer_email(
        self, contact: Contact, contact_type: str, context: Dict
    ) -> Dict[str, str]:
        """Regenerate email with more specific length requirements"""
        retry_prompt = ChatPromptTemplate.from_template("""
        The previous email was too short. Please generate a MUCH LONGER email for {name} at {company}.
        
        REQUIREMENTS:
        - Email body MUST be 400-600 words (substantially longer)
        - Include 5-7 detailed paragraphs
        - Deep dive into their notes: {notes}
        - Reference their role: {role}
        - Connect to hackathon opportunities
        - Make it highly personal and specific to them
        
        Return as JSON: {{"subject": "...", "body": "..."}}
        """)

        chain = retry_prompt | self.gemini | StrOutputParser()

        try:
            response = chain.invoke(
                {
                    "name": contact.name,
                    "role": contact.role,
                    "company": contact.company,
                    "notes": contact.notes,
                }
            )

            import json

            email_data = json.loads(response.strip())
            return {
                "subject": email_data.get(
                    "subject", f"Personalized Invitation for {contact.name}"
                ),
                "body": email_data.get(
                    "body",
                    self._generate_fallback_email(contact, contact_type, context)[
                        "body"
                    ],
                ),
            }
        except:
            return self._generate_fallback_email(contact, contact_type, context)

    def _extract_email_from_text(
        self, response: str, contact: Contact, contact_type: str
    ) -> Dict[str, str]:
        """Extract email content from non-JSON AI response"""
        lines = response.strip().split("\n")
        subject = f"Personalized Invitation for {contact.name}"
        body = ""

        # Look for subject and body in the response
        for line in lines:
            if line.lower().startswith("subject:") or line.lower().startswith(
                '"subject"'
            ):
                subject = line.split(":", 1)[1].strip().strip('"')
            elif line.lower().startswith("body:") or line.lower().startswith('"body"'):
                body = line.split(":", 1)[1].strip().strip('"')

        # If we found a body, use it; otherwise use the full response
        if not body:
            body = response.strip()

        # If the body is still too short, enhance it
        if len(body.split()) < 200:
            body = self._enhance_short_email(body, contact, contact_type)

        return {"subject": subject, "body": body}

    def _enhance_short_email(
        self, short_body: str, contact: Contact, contact_type: str
    ) -> str:
        """Enhance a short email with more details"""
        enhanced_parts = [
            short_body,
            f"\n\nBased on your background at {contact.company} and your role as {contact.role}, ",
            "we believe you would be an excellent fit for our hackathon. ",
            "Your experience and expertise would contribute significantly to the event, ",
            "and we're excited about the potential collaboration opportunities. ",
            "The hackathon will feature workshops, networking sessions, and mentorship ",
            "that align perfectly with your professional interests and career goals.",
        ]

        return "".join(enhanced_parts)

    def _generate_fallback_email(
        self, contact: Contact, contact_type: str, context: Dict
    ) -> Dict[str, str]:
        """Generate a detailed fallback email when AI fails"""
        if contact_type == "participant":
            body = f"""Hi {contact.name},

I hope this email finds you well! I'm reaching out from the TechInnovate 2024 hackathon team, and I'm genuinely excited to personally invite you to join us for what promises to be an incredible 48-hour innovation marathon.

Based on your background at {contact.company} and your role as {contact.role}, I believe you would be an excellent addition to our diverse community of innovators, creators, and problem-solvers. Your expertise and unique perspective would contribute significantly to the collaborative atmosphere we're fostering.

TechInnovate 2024, taking place March 15-17, 2024 at the University of Maryland, College Park, is centered around "AI-Powered Solutions for Tomorrow's Challenges." This theme perfectly aligns with the current technological landscape and the growing importance of AI in various industries. We've designed the event to provide participants with not just a platform to showcase their skills, but also access to invaluable resources and networking opportunities.

The hackathon will feature specialized tracks in AI/ML, Sustainability, Healthcare Tech, FinTech, and Education Innovation - areas that are rapidly evolving and offer tremendous potential for innovative solutions. You'll have the opportunity to work alongside like-minded individuals, learn from industry experts from companies like Google, Microsoft, and Amazon, and participate in hands-on workshops covering AI tools, pitch development, and business modeling.

What makes this event truly special is the comprehensive support system we've put in place. With over 500 participants, 50+ mentors, and 20+ sponsor representatives, you'll have access to an extensive network of professionals and potential collaborators. The $25,000+ prize pool is just the beginning - the real value lies in the connections you'll make and the skills you'll develop.

{contact.notes if contact.notes else "Your background and experience"} makes you an ideal candidate for this event, and I'm confident you'll find it both challenging and rewarding. Whether you're looking to expand your skill set, network with industry leaders, or simply be part of an exciting innovation community, TechInnovate 2024 offers all of these opportunities and more.

I'd love to discuss this opportunity with you further and answer any questions you might have. Please let me know if you'd like to schedule a quick call, or if you have any specific areas of interest you'd like to explore during the event.

Looking forward to hearing from you and hopefully welcoming you to our hackathon community!

Best regards,
The TechInnovate 2024 Team"""

        elif contact_type == "judge":
            body = f"""Dear {contact.name},

I hope this message finds you well. I'm writing on behalf of the TechInnovate 2024 hackathon team to extend a personal invitation for you to serve as a judge at our upcoming event.

Your distinguished background at {contact.company} and your role as {contact.role} make you an ideal candidate for this important position. We're seeking judges who not only bring technical expertise but also understand the broader impact that innovative solutions can have on society and industry.

TechInnovate 2024, scheduled for March 15-17, 2024 at the University of Maryland, College Park, will bring together over 500 participants working on "AI-Powered Solutions for Tomorrow's Challenges." As a judge, you'll have the opportunity to evaluate projects across five specialized tracks: AI/ML, Sustainability, Healthcare Tech, FinTech, and Education Innovation.

Your expertise would be invaluable in helping us identify the most promising innovations and provide constructive feedback to participants. The judging process will involve reviewing project presentations, technical implementations, and business potential, ensuring that we recognize not just technical excellence but also real-world applicability and innovation.

Beyond the judging responsibilities, this role offers significant benefits including recognition as a thought leader in the innovation community, networking opportunities with other industry experts, and the satisfaction of contributing to the development of the next generation of innovators. You'll also have the chance to participate in our post-event demo day, where you can connect with VCs and potential investors.

{contact.notes if contact.notes else "Your background and experience"} demonstrates the kind of insight and expertise that would make you an exceptional judge. We're particularly interested in judges who can provide mentorship and guidance to participants, helping them understand not just what makes a good hackathon project, but what it takes to turn innovative ideas into viable business solutions.

The time commitment is flexible, and we can work around your schedule. We'd be honored to have you join our panel of distinguished judges and contribute to making TechInnovate 2024 a truly exceptional event.

Please let me know if you'd like to discuss this opportunity further or if you have any questions about the role and responsibilities.

Best regards,
The TechInnovate 2024 Team"""

        else:  # sponsor
            body = f"""Dear {contact.name},

I hope this email finds you well. I'm reaching out from the TechInnovate 2024 hackathon team to discuss an exciting partnership opportunity that I believe would be mutually beneficial for both {contact.company} and our innovation community.

Your role as {contact.role} at {contact.company} positions you perfectly to understand the strategic value of engaging with emerging talent and innovative solutions. We're seeking sponsors who share our vision of fostering innovation and creating opportunities for the next generation of problem-solvers.

TechInnovate 2024, taking place March 15-17, 2024 at the University of Maryland, College Park, is more than just a hackathon - it's a comprehensive innovation ecosystem that brings together over 500 participants, 50+ mentors, and industry experts from leading technology companies. The event focuses on "AI-Powered Solutions for Tomorrow's Challenges," covering critical areas like AI/ML, Sustainability, Healthcare Tech, FinTech, and Education Innovation.

Sponsoring this event offers {contact.company} multiple strategic advantages. First, it provides direct access to top-tier talent - participants who have demonstrated their ability to solve complex problems and think creatively under pressure. This talent pool represents potential future employees, collaborators, or partners for your organization.

Second, sponsorship offers significant brand visibility and positioning. Your company will be prominently featured throughout the event, including in our marketing materials, event signage, and participant communications. You'll have the opportunity to showcase your company's commitment to innovation and education, enhancing your reputation in the technology community.

Third, the event provides unique networking opportunities with industry leaders, potential partners, and other sponsors. You'll have access to exclusive events and sessions where you can build relationships that could lead to future collaborations or business opportunities.

{contact.notes if contact.notes else "Your company's focus and expertise"} aligns perfectly with our hackathon themes, and we believe there's significant potential for meaningful collaboration. We offer various sponsorship tiers, each providing different levels of engagement and benefits, and we're happy to customize a package that meets your specific goals and budget.

I'd love to schedule a call to discuss this opportunity in detail, understand your objectives, and explore how we can create a partnership that delivers maximum value for {contact.company}.

Looking forward to hearing from you and exploring this exciting opportunity together.

Best regards,
The TechInnovate 2024 Team"""

        return {
            "subject": f"Personalized Invitation for {contact.name} - TechInnovate 2024",
            "body": body,
        }

    def send_email(
        self, contact: Contact, contact_type: str, email_data: Dict[str, str]
    ) -> Dict[str, Any]:
        """Send personalized email to contact"""
        try:
            if not all([self.smtp_username, self.smtp_password, self.from_email]):
                raise ValueError("SMTP credentials not configured")

            # Create message
            msg = MIMEMultipart()
            msg["From"] = self.from_email
            msg["To"] = contact.email
            msg["Subject"] = email_data["subject"]

            # Use the generated body
            body = email_data["body"]

            msg.attach(MIMEText(body, "plain"))

            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)

            return {
                "success": True,
                "email": contact.email,
                "contact_type": contact_type,
                "message": "Email sent successfully",
            }

        except Exception as e:
            return {"success": False, "email": contact.email, "error": str(e)}

    def process_outreach_campaign(self, csv_content: str) -> Dict[str, Any]:
        """Process complete outreach campaign from CSV"""
        try:
            # Process CSV
            contacts = self.process_csv(csv_content)

            if not contacts:
                return {"success": False, "error": "No contacts found in CSV"}

            results = []
            summary = {
                "total_contacts": len(contacts),
                "participants": 0,
                "judges": 0,
                "sponsors": 0,
                "emails_sent": 0,
                "emails_failed": 0,
            }

            for contact in contacts:
                # Classify contact
                contact_type = self.classify_contact(contact)
                summary[contact_type + "s"] += 1

                # Generate complete personalized email
                email_data = self.generate_personalized_email(contact, contact_type)

                # Send email
                result = self.send_email(contact, contact_type, email_data)

                if result["success"]:
                    summary["emails_sent"] += 1
                else:
                    summary["emails_failed"] += 1

                results.append(
                    {"contact": contact, "contact_type": contact_type, "result": result}
                )

            return {"success": True, "summary": summary, "results": results}

        except Exception as e:
            return {"success": False, "error": str(e)}

    def test_email_generation(self, contact: Contact) -> Dict[str, str]:
        """Test email generation without sending - useful for debugging"""
        print(f"\n🧪 Testing email generation for: {contact.name}")
        print(f"Role: {contact.role}")
        print(f"Company: {contact.company}")
        print(f"Notes: {contact.notes}")
        print(f"Contact Type: {self.classify_contact(contact)}")
        print("-" * 50)

        contact_type = self.classify_contact(contact)
        email_data = self.generate_personalized_email(contact, contact_type)

        print(f"\n📧 Generated Email:")
        print(f"Subject: {email_data['subject']}")
        print(f"Body Length: {len(email_data['body'])} characters")
        print(f"Word Count: {len(email_data['body'].split())} words")
        print(f"Body Preview: {email_data['body'][:300]}...")
        print("=" * 50)

        return email_data

    def get_sample_csv_structure(self) -> str:
        """Return sample CSV structure for users"""
        return """name,email,role,company,phone,notes
John Doe,john@example.com,Software Engineer,TechCorp Inc.,555-0123,Interested in AI/ML
Jane Smith,jane@alumni.edu,Alumni Judge,University,555-0124,Previous hackathon winner
Bob Johnson,bob@sponsor.com,Partnership Manager,SponsorCorp,555-0125,Looking for sponsorship opportunities"""
