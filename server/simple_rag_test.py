import httpx
import os
import shutil

BASE_URL = "http://127.0.0.1:8000"
DATA_DIR = "helper/data"
INDEX_DIR = "helper/faiss_index"
TEST_FILE = "test_rag_wiki.txt"
TEST_FILE_PATH = os.path.join(DATA_DIR, TEST_FILE)

def setup():
    """Sets up the environment for the RAG test."""
    print("--- Setting up test environment ---")
    # Clean up previous runs
    if os.path.exists(DATA_DIR):
        shutil.rmtree(DATA_DIR)
    if os.path.exists(INDEX_DIR):
        shutil.rmtree(INDEX_DIR)
    
    os.makedirs(DATA_DIR, exist_ok=True)

    # Create a dummy text file
    with open(TEST_FILE_PATH, "w") as f:
        f.write("This is a simple test document for the RAG agent.")
    print(f"Created dummy file: {TEST_FILE_PATH}")

    # Upload the file to create the index
    try:
        with open(TEST_FILE_PATH, "rb") as f:
            files = {"file": (TEST_FILE, f, "text/plain")}
            response = httpx.post(f"{BASE_URL}/api/add_wiki", files=files, timeout=30.0)
            response.raise_for_status()
        print("Successfully uploaded wiki and created index.")
    except httpx.RequestError as e:
        print(f"Error setting up: {e}")
        print("Please ensure the FastAPI server is running.")
        return False
    return True

def teardown():
    """Cleans up the test environment."""
    print("\n--- Tearing down test environment ---")
    if os.path.exists(DATA_DIR):
        shutil.rmtree(DATA_DIR)
    if os.path.exists(INDEX_DIR):
        shutil.rmtree(INDEX_DIR)
    print("Cleaned up dummy data and index.")

def run_rag_test():
    """Runs a simple test of the RAG chat API."""
    print("\n--- Running RAG chat test ---")
    try:
        response = httpx.post(
            f"{BASE_URL}/api/rag/chat",
            json={"message": "What is this document about?"},
            timeout=30.0
        )
        response.raise_for_status()
        data = response.json()
        print(f"RAG chat response: {data['response']}")
        if "simple test document" in data["response"].lower():
            print("Test PASSED!")
        else:
            print("Test FAILED: Response did not contain expected text.")

    except httpx.RequestError as e:
        print(f"An error occurred during the request: {e}")
        print("Please ensure the FastAPI server is running.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    if setup():
        run_rag_test()
    teardown()
