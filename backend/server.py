from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from fastapi.middleware.cors import CORSMiddleware
import json

# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this to specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Load AI Model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Load newsletters from JSON file
with open("../public/newsletters.json", "r") as f:
    newsletters = json.load(f)

# Data model for user input
class QueryInput(BaseModel):
    query: str

@app.post("/recommend")
def recommend_newsletters(input_data: QueryInput):
    user_query = input_data.query
    query_embedding = model.encode(user_query, convert_to_tensor=True)

    # Encode all newsletter descriptions
    newsletter_embeddings = model.encode([n["description"] for n in newsletters], convert_to_tensor=True)

    # Compute similarity scores
    similarities = util.pytorch_cos_sim(query_embedding, newsletter_embeddings)[0]
    
    # Sort newsletters by highest similarity
    sorted_newsletters = sorted(zip(newsletters, similarities), key=lambda x: x[1], reverse=True)

    # Convert scores to JSON-friendly format
    result = [{"title": n["title"], "description": n["description"], "score": float(score)} for n, score in sorted_newsletters]
    
    return {"recommendations": result[:3]}  # Return top 3 matches

