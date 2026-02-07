import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

def get_prediction(user_budget, bad_transactions):
    
  system_prompt = """
  You are a smart financial advisor AI for a budget app.
  Your goal is to analyze the user's discretionary spending and predict future trends.

  You must output a strictly valid JSON object with NO markdown formatting, NO backticks, and NO extra text.
  The JSON must follow this exact schema:
  {
    "description": <string>            // A short description of the prediction
    "prediction_amount": <number>,     // Predicted total spend for next month
    "percentage_change": <number>,     // % change vs current month (positive or negative)
    "savings_category": <string>,      // The specific category to cut back on
    "savings_amount": <number>,        // Money saved if they cut this category by 25%
    "months_saved": <number>           // How many months faster they reach their goal

  }
  """

  user_message = f"""
  Here is the user's monthly budget context:
  {json.dumps(user_budget)}

  Here is a list of "discretionary/bad" transactions from the last 30 days:
  {json.dumps(bad_transactions)}

  Based on this data:
  1. Predict the total spending for next month based on these bad habits continuing.
  2. Calculate the percentage change from the current month.
  3. Identify ONE specific category where they can save money (the "Savings Opportunity").
  4. Calculate how much they save if they cut that category by 25%.
  5. Estimate how many months earlier they will reach their savings goal with that extra cash.
  6. Provide a short description of the prediction.
  """

  # --- 3. MAKE THE CALL ---
  response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
      "Authorization": "Bearer " + os.getenv("OPENROUTER_API_KEY"),
    },
    data=json.dumps({
      "model": "openai/gpt-3.5-turbo", # Or "google/gemini-2.0-flash-001" which is often cheaper/faster
      "messages": [
        {
          "role": "system",
          "content": system_prompt
        },
        {
          "role": "user",
          "content": user_message
        }
      ]
    })
  )

  # --- 4. PARSE OUTPUT ---
  try:
      result = response.json()
      content = result['choices'][0]['message']['content']
      
      # Clean up if the model accidentally adds markdown
      if "```json" in content:
          content = content.replace("```json", "").replace("```", "")
          
      parsed_data = json.loads(content)


      return parsed_data
      
  except Exception as e:
      return None