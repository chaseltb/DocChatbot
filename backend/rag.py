import os
from dotenv import load_dotenv
import pinecone
import google.generativeai as genai
from langchain.embeddings import GoogleGenerativeAIEmbeddings

load_dotenv()

# Init Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Init Pinecone
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENV"))
index = pinecone.Index("rag-index")

# Embeddings
embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

def get_rag_answer(question: str, top_k: int = 5) -> str:
    query_vector = embedding_model.embed_query(question)
    results = index.query(vector=query_vector, top_k=top_k, include_metadata=True)

    context = "\n".join([match["metadata"]["text"] for match in results["matches"]])

    prompt = f"""You are an assistant with access to the following context:\n{context}\n\nAnswer this question:\n{question}"""

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text
