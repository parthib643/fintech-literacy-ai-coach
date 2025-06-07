from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage
from config import load_google_api_key

# Set the API key
load_google_api_key()

# Initialize Gemini chat model
model = init_chat_model("gemini-1.5-flash", model_provider="google_genai")

def get_chat_response(user_input):
    messages = [HumanMessage(content=user_input)]
    response = model.invoke(messages)
    return response.content
