from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routes import transactions, analysis, auth, target, reflection, budget_planner, carbon


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    target, reflection

app = FastAPI(
    title="TartanHacks Error 404 API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(analysis.router)
app.include_router(carbon.router)
app.include_router(target.router)
app.include_router(reflection.router)
app.include_router(budget_planner.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
