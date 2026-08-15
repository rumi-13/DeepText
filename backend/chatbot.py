from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.messages import HumanMessage, SystemMessage

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
    return _model


def chat(message: str) -> str:
    """Generate a response for a single user message."""
    if not message or not message.strip():
        return "Please type a message first."

    model = _get_model()

    try:
        history = [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content=message),
        ]
        response = model.invoke(history)
        return response.content.strip() or "I did not receive a valid answer."
    except Exception:
        return (
            "The AI model is temporarily unavailable. Please try again in a moment. "
            f"Your message: {message.strip()}"
        )