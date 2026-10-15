from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
load_dotenv()


_model = None


def _get_model():
    global _model

    if _model is not None:
        return _model

    _model = ChatGroq(
        model="qwen/qwen3.8-27b",
        temperature=0,
        max_tokens=150,
    )
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
        print(response.content)
        return response.content.strip().replace("*Sigh*", "") or "I did not receive a valid answer."
    except Exception:
        return (
            "The AI model is temporarily unavailable. Please try again in a moment. "
            f"Your message: {message.strip()}"
        )