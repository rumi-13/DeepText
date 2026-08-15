from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq
load_dotenv()


MODEL_REPO = "deepseek-ai/DeepSeek-V4-Flash-0731"
_model = None


def _get_model():
    global _model

    if _model is not None:
        return _model

    llm = HuggingFaceEndpoint(
        repo_id=MODEL_REPO,
        task="text-generation",
        max_new_tokens=256,
    )
    _model = ChatHuggingFace(llm=llm)

# To Enable GroqAI, uncomment the following lines and comment out the HuggingFace model above. Make sure to set your GROQ_API_KEY in the .env file.
    # _model = ChatGroq(
    #     model="llama-3.3-70b-versatile",
    #     temperature=0
    # )
    return _model


def chat(message: str):
    """Generate a response for a single user message."""
    if not message or not message.strip():
        return "Please type a message first."

    model = _get_model()
    history = [SystemMessage(content="You are a helpful assistant. Please answer the user's questions as accurately as possible.")]
    
    try:
        history.append(HumanMessage(content=message))
        response = model.invoke(history)
        history.append(response)
        return response.content.strip().replace("*Sigh*", "") or "I did not receive a valid answer."
    except Exception:
        return (
            "The AI model is temporarily unavailable. Please try again in a moment. "
            f"Your message: {message.strip()}"
        )