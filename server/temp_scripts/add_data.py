import certifi
from fastapi import FastAPI
from firebase_admin import firestore
from dotenv import load_dotenv
from server.database import init_db
import os
import json
from pathlib import Path
load_dotenv()

init_db()

file_path = Path(__file__).parent.parent / "data" / "user_2.json"

with open(file_path, "r") as f:
    data = json.load(f)

def return_email():
    db = firestore.client()
    users = db.collection("users").get()
    email = ""
    for user in users:
        email = user.to_dict()['email']
        break
    return email

def add_data(email):
    db = firestore.client()
    ref = db.collection("transactions").document(email)
    doc = ref.set(data)

if __name__ == "__main__":
    add_data(return_email())
