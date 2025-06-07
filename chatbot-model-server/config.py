import os

def load_google_api_key():
    os.environ["GOOGLE_API_KEY"] = "YOUR_API_KEY"
    return os.environ["GOOGLE_API_KEY"]
