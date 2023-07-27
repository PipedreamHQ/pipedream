# AI Code Gen for Pipedream Components

Generate components (currently actions only) using OpenAI GPT-4.


### Run

```
APP=slack
PROMPT="how to send myself a direct message?"
python run.py --app "$APP" "$PROMPT"
python run.py --app "$APP" "$PROMPT" --verbose # print debug logs
```


### Installation

```
python3 -m venv ve
source ve/bin/activate
pip install -r requirements.txt
```


### Setup

Create a `.env` file

Add these API Keys:

    - BROWSERLESS_API_KEY=api_key
    - OPENAI_API_KEY=API_KEY
    - SUPABASE_URL=https://url.supabase.co
    - SUPABASE_API_KEY=service_role_key
