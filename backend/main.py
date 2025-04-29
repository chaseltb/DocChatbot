from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag import get_rag_answer

app = FastAPI()

# CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

@app.post("/query")
async def query_docs(request: QueryRequest):
    try:
        answer = get_rag_answer(request.question)
        return {"answer": answer}
    except Exception as e:
        return {"answer": f"An error occurred: {str(e)}"}
