# AI Code Gen for Pipedream Components

Generate components using OpenAI GPT.


### Run

```
SCRIPT=generate_action.py
APP=slack
PROMPT="how to send myself a direct message?"
poetry run python3 "$SCRIPT" --app "$APP" "$PROMPT"
poetry run python3 "$SCRIPT" --app "$APP" "$PROMPT" --verbose # print debug logs
```


### Installation

1. Install poetry: follow instructions at https://python-poetry.org/docs/#installation

2. Run install:
```
poetry install
```


### Setup

Create a `.env` file

Add these API Keys:

    - BROWSERLESS_API_KEY=api_key
    - OPENAI_API_KEY=API_KEY
    - SUPABASE_URL=https://url.supabase.co
    - SUPABASE_API_KEY=service_role_key
