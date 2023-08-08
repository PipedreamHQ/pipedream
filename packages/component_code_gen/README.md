# AI Code Gen for Pipedream Components

Generate components using OpenAI GPT.


### Installation

1. Install poetry: follow instructions at https://python-poetry.org/docs/#installation

2. Run install:

```
poetry install
```


### Setup

1. Create a `.env` file

2. Add these API Keys:

    - BROWSERLESS_API_KEY=api_key
    - OPENAI_API_KEY=API_KEY
    - SUPABASE_URL=https://url.supabase.co
    - SUPABASE_API_KEY=service_role_key

3. Create a `instructions.md` file with a similar structure as the `instructions.md.example` file:

```
## Prompt

... your prompt here ...

## API docs

... copy and paste relevant parts of the api docs here ...
```


### Run

```
poetry run python main.py --component_type action --app slack --instructions instructions.md --verbose
```
