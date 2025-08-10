import os
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# You will need to set your OpenAI API key as an environment variable
# export OPENAI_API_KEY="your-api-key"


def create_vector_embeddings(data_directory: str = "data") -> FAISS:
    """
    Reads all PDF and text files from the specified directory, generates
    vector embeddings using OpenAI, and stores them in a FAISS vector store.

    Args:
        data_directory: The path to the directory containing the files.

    Returns:
        A FAISS vector store containing the embeddings.
    """
    # 1. Load Documents
    pdf_loader = DirectoryLoader(
        data_directory, glob="**/*.pdf", loader_cls=PyPDFLoader
    )
    txt_loader = DirectoryLoader(data_directory, glob="**/*.txt")
    pdf_documents = pdf_loader.load()
    txt_documents = txt_loader.load()
    documents = pdf_documents + txt_documents

    # 2. Split Documents
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = text_splitter.split_documents(documents)

    # 3. Generate Embeddings
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

    # 4. Create and Populate Vector Store
    db = FAISS.from_documents(texts, embeddings)

    # 5. Return Vector Store
    return db


if __name__ == "__main__":
    # Example usage:
    # Make sure to create a 'data' directory and add some PDF and/or TXT files.
    if not os.path.exists("data"):
        os.makedirs("data")
        print("Created 'data' directory. Please add your PDF and TXT files there.")
    else:
        # Check if there are any files to process
        if not any(
            fname.endswith(".pdf") or fname.endswith(".txt")
            for fname in os.listdir("data")
        ):
            print(
                "The 'data' directory is empty. Please add PDF or TXT files to process."
            )
        else:
            vector_store = create_vector_embeddings()
            print("Vector store created successfully.")
            # You can now save the vector store for later use:
            vector_store.save_local("faiss_index")
