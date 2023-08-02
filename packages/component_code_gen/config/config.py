from dotenv import load_dotenv
load_dotenv()

import os


config = {
    "openai": {
        "api_key": os.environ.get('OPENAI_API_KEY'),
    },
    "browserless": {
        "api_key": os.environ.get('BROWSERLESS_API_KEY'),
    },
    "supabase": {
        "url": os.environ.get('SUPABASE_URL'),
        "api_key": os.environ.get('SUPABASE_API_KEY'),
    },
    "logging": {
        "level": "DEBUG" if os.environ.get('DEBUG') == "1" else "WARN",
    },
    "model": "gpt-4",
}
