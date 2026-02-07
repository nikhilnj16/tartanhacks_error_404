import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()


response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer " + os.getenv("OPENROUTER_API_KEY"),
 
  },
  data=json.dumps({
    "model": "openai/gpt-5.2", # Optional
    "messages": [
{
  "role": "system",
  "content": 
        """You are a behavioral spending analyst. Your role is to help users understand spending patterns and trade-offs in a non-judgmental, non-prescriptive way. 
      You must not shame, command, or moralize. 
      You must not give financial advice. 
      You must frame insights in terms of time, freedom, and personal goals.
      You must be concise, empathetic, and factual."""
      },
      {
          "role": "user",
          "content":
          """Here is a user's spending analysis.\n\n\
        USER CONTEXT:\n\
        - Freedom goal: Spring Break Trip\n\
        - Days remaining to goal: 37\n\n\
        LAST 30 DAYS SUMMARY:\n\
        - Average daily spend: $32\n\
        - Average low-value probability: 0.41\n\
        - Total carbon impact: 48 kg CO₂\n\
        \n\
        LAST 7 DAYS SUMMARY:\n\
        - Average daily spend: $45\n\
        - Average low-value probability: 0.62\n\
        - Total carbon impact: 19 kg CO₂\n\
        \n\
        RECENT PATTERN SIGNAL:\n\
        - Severity score: 1.5 (recent behavior vs baseline)\n\
        - Primary category contributing to change: Food\n\
        \n\
        TASK:\n\
        Explain what has changed in the user's recent behavior compared to their baseline, \
        and provide 1–2 gentle, goal-aware suggestions that focus on awareness and trade-offs.\n\n\
        CONSTRAINTS:\n\
        - Do not shame or blame\n\
        - Do not use words like 'bad', 'unnecessary', or 'should'\n\
        - Do not give direct commands\n\
        - Tie insights to the freedom goal when relevant\n\
        - Keep response under 120 words\n\
        - Output plain text only"""
        }

    ]
  })
)

print(response.json())
