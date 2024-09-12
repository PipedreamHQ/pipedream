import os
from dotenv import load_dotenv
load_dotenv()


def get_env_var(var_name, required=False, default=None):
    if os.environ.get(var_name):
        return os.environ.get(var_name)
    if default is not None:
        return default
    if required:
        raise Exception(f"Environment variable {var_name} is required")


openai_api_type = get_env_var("OPENAI_API_TYPE", default="openai")
openai_embeddings_model = get_env_var(
    "OPENAI_EMBEDDINGS_MODEL", default="text-embedding-3-small")

config = {
    "temperature": get_env_var("OPENAI_TEMPERATURE", default=0.5),
    "openai_api_type": openai_api_type,
    "openai_embeddings_model": openai_embeddings_model,
    "openai": {
        "api_key": get_env_var("OPENAI_API_KEY", required=openai_api_type == "openai"),
        "model": get_env_var("OPENAI_MODEL", default="o1-mini"),
    },
    "browserless": {
        "api_key": get_env_var("BROWSERLESS_API_KEY"),
    },
    "supabase": {
        "url": get_env_var("SUPABASE_URL", required=True),
        "api_key": get_env_var("SUPABASE_API_KEY", required=True),
    },
    "logging": {
        "level": get_env_var("LOGGING_LEVEL", default="DEBUG"),
    },
}
