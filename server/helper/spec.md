# Specification for Vector Embedding Function

## Objective

Create a Python function that generates vector embeddings for all PDF and text files within a specified directory (`helper/data`). This function will leverage LangChain and OpenAI's models to create the embeddings, which will be stored for Retrieval-Augmented Generation (RAG).

## Function Definition

```python
def create_vector_embeddings(data_directory: str) -> FAISS:
    """
    Reads all PDF and text files from the specified directory, generates
    vector embeddings using OpenAI, and stores them in a FAISS vector store.

    Args:
        data_directory: The path to the directory containing the files.

    Returns:
        A FAISS vector store containing the embeddings.
    """
    pass
```

## Detailed Steps

1.  **Load Documents:**
    -   Use LangChain's `DirectoryLoader` to load all `*.pdf` and `*.txt` files from the `data_directory`.
    -   The `DirectoryLoader` should be configured to use the `PyPDFLoader` for PDF files and the default loader for text files.

2.  **Split Documents:**
    -   Split the loaded documents into smaller chunks using a `RecursiveCharacterTextSplitter`. This is essential for handling large documents and improving the quality of the embeddings.

3.  **Generate Embeddings:**
    -   Use `OpenAIEmbeddings` to generate vector embeddings for each document chunk. This will require an OpenAI API key.

4.  **Create and Populate Vector Store:**
    -   Use the `FAISS` vector store from LangChain to store the generated embeddings.
    -   The `FAISS.from_documents()` method will be used to create the vector store from the document chunks and their embeddings.

5.  **Return Vector Store:**
    -   The function will return the created FAISS vector store.

## Dependencies

-   `langchain`
-   `openai`
-   `faiss-cpu` (or `faiss-gpu` for GPU support)
-   `tiktoken`
-   `pypdf`
