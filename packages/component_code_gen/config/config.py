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


config = {
    "temperature": get_env_var("OPENAI_TEMPERATURE", default=0.5),
    "openai_api_type": get_env_var("OPENAI_API_TYPE", default="openai"),
    "openai": {
        "api_key": get_env_var("OPENAI_API_KEY", required=True),
        "model": get_env_var("OPENAI_MODEL", default="gpt-4-1106-preview"),
    },
    "azure": {
        "deployment_name": get_env_var("OPENAI_DEPLOYMENT_NAME", required=True),
        "api_version": get_env_var("OPENAI_API_VERSION", default="2023-05-15"),
        "api_base": get_env_var("OPENAI_API_BASE", required=True),
        "api_key": get_env_var("OPENAI_API_KEY", required=True),
        "model": get_env_var("OPENAI_MODEL", default="gpt-4-32k"),
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
