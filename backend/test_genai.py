import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')
try:
    response = model.generate_content("Hello, can you hear me?")
    print(f"Success! Response: {response.text}")
except Exception as e:
    print(f"Error with gemini-1.5-flash: {e}")

model_pro = genai.GenerativeModel('gemini-pro')
try:
    response_pro = model_pro.generate_content("Hello, can you hear me?")
    print(f"Success with gemini-pro! Response: {response_pro.text}")
except Exception as e:
    print(f"Error with gemini-pro: {e}")
