import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

candidates = [
    "gemini-1.5-flash",
    "models/gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-1.0-pro",
    "gemini-2.0-flash-exp",
    "gemini-2.0-flash",
]

with open("test_results.txt", "w") as f:
    for model_name in candidates:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hi")
            f.write(f"SUCCESS: {model_name}\n")
        except Exception as e:
            f.write(f"FAIL: {model_name} - {str(e)[:100]}...\n")
