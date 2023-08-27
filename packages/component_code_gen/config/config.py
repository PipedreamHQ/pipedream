import os
from dotenv import load_dotenv
load_dotenv()


DEFAULTS = {
    "OPENAI_API_TYPE": "openai",
    "OPENAI_MODEL": "gpt-4",
    "OPENAI_API_VERSION": "2023-05-15",
    "LOGGING_LEVEL": "WARN",
    "ENABLE_DOCS": False
}


def get_env_var(var_name, required=False):
    if os.environ.get(var_name):
        return os.environ.get(var_name)
    if required and var_name not in DEFAULTS:
        raise Exception(f"Environment variable {var_name} is required")
    if var_name in DEFAULTS:
        return DEFAULTS[var_name]


config = {
    "temperature": get_env_var("OPENAI_TEMPERATURE") or 0.5,
    "openai_api_type": get_env_var("OPENAI_API_TYPE"),
    "openai": {
        "api_key": get_env_var("OPENAI_API_KEY", required=True),
        "model": get_env_var("OPENAI_MODEL"),
    },
    "azure": {
        "deployment_name": get_env_var("OPENAI_DEPLOYMENT_NAME"),
        "api_version": get_env_var("OPENAI_API_VERSION"),
        "api_base": get_env_var("OPENAI_API_BASE"),
        "api_key": get_env_var("OPENAI_API_KEY", required=True),
        "model": get_env_var("OPENAI_MODEL"),
    },
    "browserless": {
        "api_key": get_env_var("BROWSERLESS_API_KEY"),
    },
    "supabase": {
        "url": get_env_var("SUPABASE_URL", required=True),
        "api_key": get_env_var("SUPABASE_API_KEY", required=True),
    },
    "logging": {
        "level": get_env_var("LOGGING_LEVEL"),
    },
    "enable_docs": get_env_var("ENABLE_DOCS") or False,
}
