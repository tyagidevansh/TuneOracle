from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.user_routes import user_router  
from routes.ytmusic_routes import ytmusic_router
import os

app = FastAPI()

origins = [
    "http://localhost:3000",  
    "http://localhost:3001", 
    "https://tune-oracle.vercel.app/",
    "https://tuneoracle.onrender.com",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(ytmusic_router)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)