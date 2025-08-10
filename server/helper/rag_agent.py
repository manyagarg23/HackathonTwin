
import os
import argparse
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

# You will need to set your OpenAI API key as an environment variable
# export OPENAI_API_KEY="your-api-key"

INDEX_DIRECTORY = "faiss_index"

def create_rag_agent(index_path: str):
    """
    Creates a Retrieval-Augmented Generation (RAG) agent.

    Args:
        index_path: The path to the FAISS index directory.

    Returns:
        A retrieval chain that can be used to answer questions.
    """
    # 1. Load the Vector Store
    if not os.path.exists(index_path):
        raise FileNotFoundError(
            f"FAISS index directory not found at '{index_path}'. "
            f"Please run 'python embeddings.py' first to create it."
        )

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    vector_store = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)


    # 2. Create a Retriever
    retriever = vector_store.as_retriever()

    # 3. Create a Prompt Template
    prompt_template = """
    You are a helpful support agent. Use the following pieces of context from the knowledge base to answer the user's question.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.

    Context:
    {context}

    Question:
    {input}

    Helpful Answer:
    """
    PROMPT = ChatPromptTemplate.from_template(prompt_template)

    # 4. Create the RAG Chain
    llm = ChatOpenAI(temperature=0, model_name="gpt-4o")
    
    question_answer_chain = create_stuff_documents_chain(llm, PROMPT)
    qa_chain = create_retrieval_chain(retriever, question_answer_chain)

    return qa_chain

def ask_question(qa_chain, query: str):
    """
    Asks a question to the RAG agent and prints the response.
    """
    print(f"> Asking: {query}")
    response = qa_chain.invoke({"input": query})
    print("> Answer:")
    print(response["answer"])
    print("> Sources:")
    sources = set()
    for doc in response["context"]:
        sources.add(doc.metadata.get('source', 'Unknown'))
    for source in sources:
        print(f"- {source}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Query a RAG agent with a knowledge base.")
    parser.add_argument("query", type=str, help="The question to ask the agent.")
    args = parser.parse_args()

    try:
        agent = create_rag_agent(INDEX_DIRECTORY)
        ask_question(agent, args.query)
    except FileNotFoundError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
