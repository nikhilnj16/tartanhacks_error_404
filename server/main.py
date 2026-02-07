from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import transactions, analysis, target, reflection

app = FastAPI(
    title="TartanHacks Error 404 API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(analysis.router)
app.include_router(target.router)
app.include_router(reflection.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
